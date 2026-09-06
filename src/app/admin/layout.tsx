'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Shield,
  Users,
  Trophy,
  Calendar,
  Clock,
  Image as ImageIcon,
  Newspaper,
  Award,
  Navigation,
  Settings,
  FolderOpen,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change or Escape
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If on login page, render clean layout without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navGroups = [
    {
      title: 'DASHBOARD',
      items: [{ label: 'Overview', href: '/admin', icon: LayoutDashboard }],
    },
    {
      title: 'CONTENT MANAGEMENT',
      items: [
        { label: 'Hero Slide', href: '/admin/hero', icon: Sparkles },
        { label: 'Team Story', href: '/admin/team', icon: Shield },
        { label: 'Players / Roster', href: '/admin/players', icon: Users },
        { label: 'Seasons', href: '/admin/seasons', icon: Trophy },
        { label: 'Matches & Scores', href: '/admin/matches', icon: Calendar },
        { label: 'Journey Milestones', href: '/admin/journey', icon: Clock },
        { label: 'Gallery Moments', href: '/admin/gallery', icon: ImageIcon },
        { label: 'News & Articles', href: '/admin/news', icon: Newspaper },
        { label: 'Sponsors', href: '/admin/sponsors', icon: Award },
      ],
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Navigation Links', href: '/admin/navigation', icon: Navigation },
        { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
        { label: 'Site Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/brand/logo-crest.png" alt="Logo" className="w-8 h-8 rounded-full bg-black object-contain" />
          <span className="font-semibold text-sm text-white">Nawabs Admin CMS</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-zinc-700 p-1 shrink-0 flex items-center justify-center">
              <img src="/brand/logo-crest.png" alt="Nizam Nawabs" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide leading-tight">
                Nizam Nawabs
              </h2>
              <span className="text-[10px] text-orange-400 font-mono font-medium block">
                CMS BACKOFFICE
              </span>
            </div>
          </Link>
        </div>

        {/* Links Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[10px] font-semibold font-mono tracking-wider text-zinc-500 uppercase">
                {group.title}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-600 text-white font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
              <span>View Public Website</span>
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
