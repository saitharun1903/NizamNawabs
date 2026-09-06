'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Loader2, Globe } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    teamName: '',
    shortName: '',
    tagline: '',
    logoUrl: '',
    primaryColor: '#FF5E00',
    secondaryColor: '#080809',
    instagramUrl: '',
    youtubeUrl: '',
    contactEmail: '',
    phone: '',
    location: '',
    footerText: '',
    seoTitle: '',
    seoDescription: '',
    ogImageUrl: '',
    aiEnabled: true,
    aiAssistantName: 'Nizam Nawabs Assistant',
    aiWelcomeMessage: "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?",
    aiSuggestedPrompts: "Who are Nizam Nawabs?;Show me the roster;When is the next match?;Tell me about Season 1;Latest team news",
    tickerText: '',
  });

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      setToastMessage('Global website settings saved successfully!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 font-mono text-xs">Loading website settings...</div>;
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
            Site Settings & Identity
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global configurations, brand tokens, verified social links, and SEO metadata
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              Franchise Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Team Name *</label>
                <input
                  type="text"
                  required
                  value={settings.teamName}
                  onChange={(e) => setSettings({ ...settings, teamName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Short Name</label>
                <input
                  type="text"
                  value={settings.shortName}
                  onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Official Tagline / Bio *</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <ImageUpload
              value={settings.logoUrl}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              label="Primary Logo Crest"
            />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              Verified Social Channels & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Instagram URL</label>
                <input
                  type="text"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">YouTube Highlights URL</label>
                <input
                  type="text"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Headquarters / Location</label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Footer Legal Statement</label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              SEO & Social Sharing
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Global SEO Title</label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Global SEO Description</label>
              <textarea
                rows={2}
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div>
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                  Gemini AI Assistant Configuration
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Controls the public floating AI assistant, greeting text, and prompt chips.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiEnabled}
                  onChange={(e) => setSettings({ ...settings, aiEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                <span className="ml-2 text-xs font-medium text-zinc-300">
                  {settings.aiEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Assistant Display Name</label>
              <input
                type="text"
                value={settings.aiAssistantName}
                onChange={(e) => setSettings({ ...settings, aiAssistantName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">Welcome Greeting</label>
              <textarea
                rows={2}
                value={settings.aiWelcomeMessage}
                onChange={(e) => setSettings({ ...settings, aiWelcomeMessage: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">
                Suggested Prompt Chips (Semicolon separated)
              </label>
              <input
                type="text"
                value={settings.aiSuggestedPrompts}
                onChange={(e) => setSettings({ ...settings, aiSuggestedPrompts: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
              <p>
                🔒 <strong className="text-zinc-300">Security Notice:</strong> The Google Gemini API key (<code className="text-orange-400">GEMINI_API_KEY</code>) is stored exclusively in server environment variables and is never exposed in the CMS or browser.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                Marquee Ticker (Orange Ribbon)
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Configure custom text phrases for the kinetic orange marquee on the public website. Separate phrases with bullets (•), semicolons, or newlines. If left blank, the marquee dynamically auto-assembles from verified live data (active season, next match, latest result, and arena).
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase">
                Custom Marquee Phrases (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Leave blank for automatic live data generation, OR enter custom phrases: NIZAM NAWABS • TELANGANA PRO BASKETBALL • UNSTOPPABLE SPIRIT"
                value={settings.tickerText || ''}
                onChange={(e) => setSettings({ ...settings, tickerText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Site Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
