import React from 'react';
import prisma from '@/lib/db';
import { Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/icons/BrandSocialIcons';
import ContactForm from '@/components/public/ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let settings: any = null;
  try {
    settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  } catch (err) {
    console.warn('[ContactPage] Database query notice (using defaults):', err);
  }

  const contactEmail = settings?.contactEmail || 'contact@nizamnawabs.com';
  const location = settings?.location || 'Hyderabad, Telangana, India';
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/nizamnawabs_basketball/';
  const youtubeUrl = settings?.youtubeUrl || 'https://www.youtube.com/@fgsnpro';

  return (
    <div className="py-12 sm:py-24 space-y-10 sm:space-y-16 bg-brand-black">
      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4 text-brand-orange" />
            <span>CLUB COMMUNICATIONS</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            CONNECT WITH <span className="text-brand-orange">THE NAWABS</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            Reach out for player scouting, media credentials, sponsorships, or official franchise correspondence.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 sm:p-8 space-y-4 shadow-xl">
              <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                HEADQUARTERS & ARENA
              </h3>

              <div className="space-y-4 text-sm text-zinc-300 font-sans">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-white block">Home Ground</span>
                    <span>Kotla Vijaya Bhaskara Reddy (KVBR) Indoor Stadium</span>
                    <span className="block text-xs text-zinc-400 font-sans pt-0.5">
                      Yousufguda, Hyderabad, Telangana 500045
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-white block">Official Email</span>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-brand-orange hover:underline font-sans text-xs font-medium"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Channels */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                VERIFIED SOCIALS
              </h3>
              <p className="text-xs text-zinc-300 font-sans">
                Official handles managed by Nizam Nawabs digital team:
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-surface-dark border border-surface-border hover:border-brand-orange transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <InstagramIcon className="w-5 h-5 text-pink-500" />
                    <div>
                      <span className="font-display font-bold text-lg text-white group-hover:text-brand-orange transition-colors block leading-none">
                        @nizamnawabs_basketball
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans font-medium">
                        Official Instagram Profile
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
                    FOLLOW →
                  </span>
                </a>

                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-surface-dark border border-surface-border hover:border-red-500 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <YoutubeIcon className="w-5 h-5 text-red-500" />
                    <div>
                      <span className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors block leading-none">
                        @fgsnpro
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans font-medium">
                        YouTube Match Highlights
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-500">
                    WATCH →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 sm:p-8 md:p-10 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                SEND AN INQUIRY
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                Inquiries are directed to the team front office.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
