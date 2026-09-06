'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Copy, Check, FolderOpen, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface MediaAsset {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  altText: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      const res = await fetch('/api/admin/media/upload');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadDone = (url: string) => {
    setUploadedUrl(url);
    loadAssets();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Media Asset Library
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Direct file upload management, CDN-style local storage, and media URL copying
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl max-w-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Upload New Asset
        </h3>
        <ImageUpload
          value={uploadedUrl}
          onChange={handleUploadDone}
          label="Select image file"
          helperText="Supported formats: JPG, PNG, WEBP, SVG up to 10MB"
        />
        {uploadedUrl && (
          <p className="text-xs text-emerald-400 font-mono">
            ✓ Uploaded: {uploadedUrl}
          </p>
        )}
      </div>

      {/* Asset Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Stored Assets ({assets.length})
          </h3>
          <span className="text-xs font-mono text-zinc-500">Stored in public/uploads/</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-3 space-y-2 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
            >
              <div className="relative h-28 bg-black rounded-lg overflow-hidden border border-zinc-800">
                <img src={asset.fileUrl} alt={asset.altText} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-medium text-white truncate block" title={asset.filename}>
                  {asset.filename}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono block">
                  {(asset.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(asset.id, asset.fileUrl)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                {copiedId === asset.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[11px]">Copy URL</span>
                  </>
                )}
              </button>
            </div>
          ))}

          {assets.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-xs text-zinc-500 font-mono">
              No media uploaded to local storage yet. Use the upload box above to add images.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
