'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Trophy,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface Metrics {
  totalPlayers: number;
  activePlayers: number;
  totalMatches: number;
  upcomingMatches: number;
  totalGallery: number;
  publishedArticles: number;
  draftArticles: number;
  seasonsCount: number;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  userEmail: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.recentLogs) setLogs(data.recentLogs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time control center for Nizam Nawabs dynamic platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-200 hover:text-white hover:border-zinc-500 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Players / Roster
            </span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {metrics ? metrics.totalPlayers : 0}
            </div>
            <span className="text-[11px] text-zinc-500">
              {metrics ? `${metrics.activePlayers} active on squad` : '0 active'}
            </span>
          </div>
          <Link
            href="/admin/players"
            className="text-xs font-medium text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 pt-1"
          >
            <span>Manage Squad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Fixtures & Scores
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {metrics ? metrics.totalMatches : 0}
            </div>
            <span className="text-[11px] text-zinc-500">
              {metrics ? `${metrics.upcomingMatches} upcoming games` : '0 upcoming'}
            </span>
          </div>
          <Link
            href="/admin/matches"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 pt-1"
          >
            <span>Update Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              News & Stories
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {metrics ? metrics.publishedArticles : 0}
            </div>
            <span className="text-[11px] text-zinc-500">
              {metrics ? `${metrics.draftArticles} in drafts` : '0 drafts'}
            </span>
          </div>
          <Link
            href="/admin/news"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 pt-1"
          >
            <span>Edit News</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Media Gallery
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {metrics ? metrics.totalGallery : 0}
            </div>
            <span className="text-[11px] text-zinc-500">Published moments</span>
          </div>
          <Link
            href="/admin/gallery"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 pt-1"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Access Actions Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/players"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Add Player</span>
          </Link>
          <Link
            href="/admin/matches"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Schedule Fixture</span>
          </Link>
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Write Article</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Upload Photo</span>
          </Link>
          <Link
            href="/admin/hero"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <span>Edit Hero Slide</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors"
          >
            <span>Site Identity & Socials</span>
          </Link>
        </div>
      </div>

      {/* Recent Audit & Activity Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Activity & Audit Log
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Live DB events</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      log.action === 'CREATE'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : log.action === 'UPDATE'
                        ? 'bg-blue-500/15 text-blue-400'
                        : log.action === 'DELETE'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-medium text-zinc-200">{log.details}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 font-mono text-[11px]">
                  <span>{log.userEmail}</span>
                  <span>•</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
              No recent activity records logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
