'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Check, Loader2, ExternalLink, Eye } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [hero, setHero] = useState({
    id: '',
    eyebrow: '',
    title: '',
    subtitle: '',
    ctaLabel: '',
    ctaUrl: '',
    secondaryCtaLabel: '',
    secondaryCtaUrl: '',
    backgroundMediaUrl: '',
    isPublished: true,
  });

  const loadHero = async () => {
    try {
      const res = await fetch('/api/admin/hero');
      const data = await res.json();
      if (data.hero) setHero(data.hero);
    } catch (err) {
      console.error('Failed to load hero slide:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });

      if (!res.ok) throw new Error('Failed to update hero');

      setToastMessage('Hero slide configuration updated successfully!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error updating hero');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 font-mono text-xs">Loading Hero configuration...</div>;
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
            Hero Experience CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure primary headlines, CTAs, and media for the public homepage opening
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-200 hover:text-white rounded-lg transition-colors"
        >
          <span>Preview Live Homepage</span>
          <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase">
                Badge / Eyebrow Text *
              </label>
              <input
                type="text"
                required
                value={hero.eyebrow}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase">
                Main Headline (Title) *
              </label>
              <input
                type="text"
                required
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase">
                Subheadline / Narrative Copy *
              </label>
              <textarea
                rows={3}
                required
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Primary CTA Label *</label>
                <input
                  type="text"
                  required
                  value={hero.ctaLabel}
                  onChange={(e) => setHero({ ...hero, ctaLabel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Primary CTA Destination URL *</label>
                <input
                  type="text"
                  required
                  value={hero.ctaUrl}
                  onChange={(e) => setHero({ ...hero, ctaUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Secondary CTA Label</label>
                <input
                  type="text"
                  value={hero.secondaryCtaLabel}
                  onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Secondary CTA Destination URL</label>
                <input
                  type="text"
                  value={hero.secondaryCtaUrl}
                  onChange={(e) => setHero({ ...hero, secondaryCtaUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <ImageUpload
              value={hero.backgroundMediaUrl}
              onChange={(url) => setHero({ ...hero, backgroundMediaUrl: url })}
              label="Background Image / Media"
            />

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isPublishedHero"
                checked={hero.isPublished}
                onChange={(e) => setHero({ ...hero, isPublished: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <label htmlFor="isPublishedHero" className="text-xs font-medium text-zinc-300 cursor-pointer">
                Publish this Hero configuration live on public site
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Visual Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-orange-400" />
            <span>Live Simulated Preview</span>
          </div>

          <div className="bg-black border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 blur-3xl pointer-events-none" />

            <div className="inline-block px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-[10px] font-mono uppercase text-orange-400 font-bold">
              {hero.eyebrow || 'BADGE TEXT'}
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
              {hero.title || 'NIZAM NAWABS'}
            </h2>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {hero.subtitle || 'Hero narrative and subtitle copy...'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-4 py-2 rounded bg-orange-600 text-white text-xs font-bold uppercase tracking-wider inline-block">
                {hero.ctaLabel || 'PRIMARY CTA'}
              </span>
              {hero.secondaryCtaLabel && (
                <span className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider inline-block">
                  {hero.secondaryCtaLabel}
                </span>
              )}
            </div>

            {hero.backgroundMediaUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800 max-h-36">
                <img src={hero.backgroundMediaUrl} alt="Hero Media" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
