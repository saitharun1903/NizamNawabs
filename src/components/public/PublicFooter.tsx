import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Trophy, ShieldCheck } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/icons/BrandSocialIcons';

interface PublicFooterProps {
  settings?: {
    teamName: string;
    tagline: string;
    footerText: string;
    instagramUrl: string;
    youtubeUrl: string;
    contactEmail: string;
    location: string;
  };
  achievementBadge?: string;
}

export default function PublicFooter({ settings, achievementBadge }: PublicFooterProps) {
  const teamName = settings?.teamName || 'Nizam Nawabs';
  const tagline = settings?.tagline || 'Bold basketball, local pride, unstoppable spirit';
  const footerText = settings?.footerText || '© Nizam Nawabs Professional Basketball Club. Telangana, India.';
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/nizamnawabs_basketball/';
  const youtubeUrl = settings?.youtubeUrl || 'https://www.youtube.com/@fgsnpro';
  const contactEmail = settings?.contactEmail || 'contact@nizamnawabs.com';
  const location = settings?.location || 'Hyderabad, Telangana, India';

  return (
    <footer className="relative bg-brand-black border-t border-surface-border text-zinc-400 pt-16 pb-12 overflow-hidden">
      {/* Subtle brand glow behind footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-surface-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo-crest.png"
                alt={teamName}
                className="w-12 h-12 object-contain rounded-full border border-brand-orange/40 bg-black"
              />
              <div>
                <h3 className="font-display font-black text-3xl tracking-tight text-white leading-none">
                  {teamName.toUpperCase()}
                </h3>
                <p className="text-[10px] uppercase font-sans font-bold tracking-wider text-brand-orange">
                  Telangana Pro Basketball
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-sans">
              {tagline}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-xs font-sans font-bold tracking-wider text-brand-orange uppercase">
              <Trophy className="w-3.5 h-3.5 text-brand-orange" />
              <span>{achievementBadge || 'TELANGANA PRO BASKETBALL'}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-zinc-300 hover:text-brand-orange hover:border-brand-orange hover:scale-105 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                title="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-zinc-300 hover:text-red-500 hover:border-red-500 hover:scale-105 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                title="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="w-11 h-11 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-zinc-300 hover:text-white hover:border-white hover:scale-105 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                title="Email Team"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-lg tracking-wide text-white uppercase">FRANCHISE</h4>
            <ul className="space-y-2 text-xs font-sans font-semibold tracking-wide uppercase">
              <li>
                <Link href="/team" className="hover:text-brand-orange transition-colors">
                  Identity & Story
                </Link>
              </li>
              <li>
                <Link href="/roster" className="hover:text-brand-orange transition-colors">
                  Player Roster
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-brand-orange transition-colors">
                  TPBL Schedule
                </Link>
              </li>
              <li>
                <Link href="/journey" className="hover:text-brand-orange transition-colors">
                  The Journey Timeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Media & Community */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-lg tracking-wide text-white uppercase">COVERAGE</h4>
            <ul className="space-y-2 text-xs font-sans font-semibold tracking-wide uppercase">
              <li>
                <Link href="/gallery" className="hover:text-brand-orange transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand-orange transition-colors">
                  Team Announcements
                </Link>
              </li>
              <li>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <span>Match Highlights</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Trials & Scouting
                </Link>
              </li>
            </ul>
          </div>

          {/* Headquarters / Legal */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-lg tracking-wide text-white uppercase">TELANGANA BASE</h4>
            <div className="space-y-2 text-xs text-zinc-400 font-sans">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{contactEmail}</span>
              </p>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block">
                  League Affiliation:
                </span>
                <span className="text-xs text-white font-semibold font-sans">Telangana Pro Basketball League</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grand Typographic Final Scene */}
        <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-surface-border/40 select-none overflow-hidden text-center">
          <h2 className="font-display text-[clamp(2.2rem,13vw,11rem)] leading-[0.82] tracking-tight sm:tracking-tighter text-zinc-800/40 uppercase font-black hover:text-brand-orange/20 transition-colors duration-700 break-words">
            NIZAM NAWABS
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-sans border-t border-surface-border/40">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              Verified Sports Platform
            </span>
            <Link href="/admin/login" className="text-zinc-500 hover:text-zinc-300 transition-colors text-[10px]">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
