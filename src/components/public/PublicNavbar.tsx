'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/icons/BrandSocialIcons';

interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
}

interface PublicNavbarProps {
  navItems?: NavItem[];
  teamName?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export default function PublicNavbar({
  navItems = [],
  teamName = 'Nizam Nawabs',
  instagramUrl = 'https://www.instagram.com/nizamnawabs_basketball/',
  youtubeUrl = 'https://www.youtube.com/@fgsnpro',
}: PublicNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manage body scroll locking and Escape key for mobile overlay
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Close menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const defaultLinks: NavItem[] = [
    { id: '1', label: 'HOME', url: '/', isExternal: false },
    { id: '2', label: 'TEAM', url: '/team', isExternal: false },
    { id: '3', label: 'ROSTER', url: '/roster', isExternal: false },
    { id: '4', label: 'MATCHES', url: '/matches', isExternal: false },
    { id: '5', label: 'JOURNEY', url: '/journey', isExternal: false },
    { id: '6', label: 'GALLERY', url: '/gallery', isExternal: false },
    { id: '7', label: 'NEWS', url: '/news', isExternal: false },
    { id: '8', label: 'CONTACT', url: '/contact', isExternal: false },
  ];

  const links = navItems.length > 0 ? navItems : defaultLinks;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 pt-[var(--sat)] ${
          isScrolled
            ? 'bg-brand-black/95 backdrop-blur-md border-b border-surface-border/60 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4 sm:py-5'
        }`}
        style={{
          transition:
            'background-color 450ms cubic-bezier(0.16, 1, 0.3, 1), border-color 450ms cubic-bezier(0.16, 1, 0.3, 1), padding 450ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo Crest & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-brand-orange/40 bg-black/60 p-0.5 group-hover:border-brand-orange transition-colors shrink-0">
              <img
                src="/brand/logo-crest.png"
                alt="Nizam Nawabs Crest"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-brand-orange transition-colors leading-none">
                {teamName.toUpperCase()}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-sans font-semibold tracking-widest text-zinc-400 leading-tight">
                TELANGANA • PRO BASKETBALL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Manrope Refined Upper (1024px+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {links.map((link) => {
              const isActive = pathname === link.url;
              return (
                <Link
                  key={link.id || link.url}
                  href={link.url}
                  className={`px-3 py-1.5 text-[12px] uppercase tracking-wide font-sans font-semibold rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-brand-orange bg-brand-orange/10 font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Socials (1024px+) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-zinc-400 hover:text-brand-orange hover:bg-white/5 transition-colors"
              title="Follow on Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-white/5 transition-colors"
              title="Watch Highlights on YouTube"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg shadow-brand-orange/20 shrink-0"
            >
              <span>JOIN THE PRIDE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile / Tablet Menu Button (Up to 1023px) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-zinc-200 hover:text-brand-orange rounded-xl bg-surface-card/60 border border-surface-border/60 backdrop-blur-md transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile & Tablet Editorial Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="fixed inset-0 z-50 bg-[#080809]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 pt-[calc(1.5rem+var(--sat))] pb-[calc(1.5rem+var(--sab))] animate-fade-in overflow-y-auto"
        >
          {/* Top Bar inside Overlay: Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-surface-border/60 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo-crest.png"
                alt="Logo Crest"
                className="w-9 h-9 rounded-full bg-black border border-brand-orange/40 object-contain p-0.5"
              />
              <span className="font-display font-black text-xl text-white uppercase tracking-tight">
                {teamName}
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="min-w-[48px] min-h-[48px] p-2 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-zinc-300 hover:text-white hover:border-brand-orange transition-colors"
              aria-label="Close Navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links with Editorial Indexing */}
          <nav className="py-6 sm:py-8 flex flex-col justify-center space-y-1 sm:space-y-2 flex-1">
            {links.map((link, idx) => {
              const isActive = pathname === link.url;
              const indexStr = String(idx + 1).padStart(2, '0');
              return (
                <Link
                  key={link.id || link.url}
                  href={link.url}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    animation: 'fadeSlideIn 320ms cubic-bezier(0.16, 1, 0.3, 1) backwards',
                    animationDelay: `${idx * 45}ms`,
                  }}
                  className={`group flex items-center justify-between py-2 sm:py-2.5 px-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-orange/15 text-brand-orange'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-sans font-bold text-xs text-brand-orange/70 group-hover:text-brand-orange">
                      {indexStr}
                    </span>
                    <span className="font-display font-black text-3xl sm:text-4xl tracking-tight uppercase group-hover:translate-x-1.5 transition-transform">
                      {link.label}
                    </span>
                  </div>
                  {isActive ? (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-brand-orange text-white px-2 py-0.5 rounded-full">
                      CURRENT
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section: CTA & Socials */}
          <div className="pt-6 border-t border-surface-border/60 space-y-4 shrink-0">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[48px] bg-brand-orange hover:bg-brand-orangeHover text-white py-3 rounded-xl font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all"
            >
              <span>JOIN THE PRIDE • TRIALS & SCOUTING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-sans pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                TELANGANA PRO BASKETBALL
              </span>
              <div className="flex items-center gap-4">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-300 hover:text-brand-orange"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-300 hover:text-red-500"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
