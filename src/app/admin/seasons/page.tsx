'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy, Check, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

interface Season {
  id: string;
  seasonName: string;
  seasonNumber: number;
  year: string;
  achievement: string;
  description: string;
  coverImageUrl: string;
  isCurrent: boolean;
  status: string;
  displayOrder: number;
}

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    seasonName: '',
    seasonNumber: 1,
    year: '2024',
    achievement: '',
    description: '',
    coverImageUrl: '/brand/highlight-season1.png',
    isCurrent: false,
    status: 'Active',
    displayOrder: 0,
  });

  const loadSeasons = async () => {
    try {
      const res = await fetch('/api/admin/seasons');
      const data = await res.json();
      if (data.seasons) setSeasons(data.seasons);
    } catch (err) {
      console.error('Failed to load seasons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedSeason(null);
    setFormData({
      seasonName: `TPBL Season ${seasons.length + 1}`,
      seasonNumber: seasons.length + 1,
      year: String(new Date().getFullYear()),
      achievement: 'Championship Contenders',
      description: '',
      coverImageUrl: '/brand/highlight-season1.png',
      isCurrent: true,
      status: 'Active',
      displayOrder: seasons.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Season) => {
    setSelectedSeason(s);
    setFormData({
      seasonName: s.seasonName,
      seasonNumber: s.seasonNumber,
      year: s.year,
      achievement: s.achievement,
      description: s.description,
      coverImageUrl: s.coverImageUrl,
      isCurrent: s.isCurrent,
      status: s.status,
      displayOrder: s.displayOrder,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedSeason ? `/api/admin/seasons/${selectedSeason.id}` : '/api/admin/seasons';
      const method = selectedSeason ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save season');

      showToast(selectedSeason ? 'Season updated.' : 'New season added.');
      setIsFormOpen(false);
      loadSeasons();
    } catch (err: any) {
      alert(err.message || 'Error saving season');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSeason) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/seasons/${selectedSeason.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete season');

      showToast('Season deleted.');
      setIsDeleteOpen(false);
      loadSeasons();
    } catch (err: any) {
      alert(err.message || 'Error deleting season');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
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
            Seasons & Silverware
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage official league campaigns, Season 1 Runners Up achievements, and upcoming editions
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Season</span>
        </button>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seasons.map((s) => (
          <div
            key={s.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{s.seasonName}</span>
                  {s.isCurrent && (
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase">
                      Current
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-zinc-400 font-bold">{s.year}</span>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  {s.achievement}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>

              {s.coverImageUrl && (
                <div className="rounded-lg overflow-hidden border border-zinc-800 max-h-40">
                  <img src={s.coverImageUrl} alt={s.seasonName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500">Status: {s.status}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  title="Edit Season"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedSeason(s);
                    setIsDeleteOpen(true);
                  }}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                  title="Delete Season"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedSeason ? 'Edit Season Campaign' : 'Create Season Campaign'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Season Name *</label>
                <input
                  type="text"
                  required
                  value={formData.seasonName}
                  onChange={(e) => setFormData({ ...formData, seasonName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Season Number *</label>
                  <input
                    type="number"
                    required
                    value={formData.seasonNumber}
                    onChange={(e) => setFormData({ ...formData, seasonNumber: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={formData.achievement}
                  onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                  placeholder="e.g. Runners Up"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <ImageUpload
                value={formData.coverImageUrl}
                onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                label="Cover Graphic"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Campaign Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isCurrentSeason"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="isCurrentSeason" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Mark as Current / Active Season
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Season</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Season Record?"
        message={`Are you sure you want to delete ${selectedSeason?.seasonName}?`}
        confirmLabel="Delete Season"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
