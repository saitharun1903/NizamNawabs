'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Save, Check, Loader2, Trophy } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminTeamPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [teamInfo, setTeamInfo] = useState({
    headline: '',
    philosophy: '',
    telanganaIdentity: '',
    homeCourt: '',
    bannerImageUrl: '',
    achievementSummary: '',
  });

  const loadTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.teamInfo) setTeamInfo(data.teamInfo);
    } catch (err) {
      console.error('Failed to load team info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamInfo),
      });

      if (!res.ok) throw new Error('Failed to update team info');

      setToastMessage('Team info & philosophy saved!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error updating team info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 font-mono text-xs">Loading team info...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Team Philosophy & Identity
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage the franchise mission statement, Telangana heritage, and achievement highlights
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase">
              Brand Headline *
            </label>
            <input
              type="text"
              required
              value={teamInfo.headline}
              onChange={(e) => setTeamInfo({ ...teamInfo, headline: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase">
              Franchise Philosophy *
            </label>
            <textarea
              rows={4}
              required
              value={teamInfo.philosophy}
              onChange={(e) => setTeamInfo({ ...teamInfo, philosophy: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase">
              Telangana Identity Narrative *
            </label>
            <textarea
              rows={3}
              required
              value={teamInfo.telanganaIdentity}
              onChange={(e) => setTeamInfo({ ...teamInfo, telanganaIdentity: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase">
              Official Home Court / Arena *
            </label>
            <input
              type="text"
              required
              value={teamInfo.homeCourt}
              onChange={(e) => setTeamInfo({ ...teamInfo, homeCourt: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase">
              Achievements Summary *
            </label>
            <input
              type="text"
              required
              value={teamInfo.achievementSummary}
              onChange={(e) => setTeamInfo({ ...teamInfo, achievementSummary: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <ImageUpload
            value={teamInfo.bannerImageUrl}
            onChange={(url) => setTeamInfo({ ...teamInfo, bannerImageUrl: url })}
            label="Team Feature Banner Photo"
          />

          <div className="pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Team Information</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
