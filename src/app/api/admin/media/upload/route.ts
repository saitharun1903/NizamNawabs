import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Allowed mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, WEBP, and SVG are accepted.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds the 10MB limit.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and generate unique filename
    const ext = path.extname(file.name) || '.png';
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `${base}-${Date.now()}${ext}`;
    let fileUrl = '';

    // If Vercel Blob token is configured, upload directly to global cloud CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`uploads/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
        });
        fileUrl = blob.url;
      } catch (blobErr) {
        console.error('Vercel Blob upload failed, falling back:', blobErr);
      }
    }

    // Local filesystem / serverless fallback
    if (!fileUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        fileUrl = `/uploads/${filename}`;
      } catch (fsErr) {
        console.warn('Local disk write unavailable, using data URI fallback:', fsErr);
        fileUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
      }
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        altText: altText || file.name,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPLOAD',
        entityType: 'MediaAsset',
        entityId: asset.id,
        details: `Uploaded media: ${filename}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({
      success: true,
      asset,
      fileUrl,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to process media upload.' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ assets });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch media assets.' }, { status: 500 });
  }
}
