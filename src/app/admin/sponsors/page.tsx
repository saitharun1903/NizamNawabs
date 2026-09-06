'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Check, Loader2, ExternalLink } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: string;
  websiteUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    tier: 'Official Partner',
    websiteUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  const loadSponsors = async () => {
    try {
      const res = await fetch('/api/admin/sponsors');
      const data = await res.json();
      if (data.sponsors) setSponsors(data.sponsors);
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedSponsor(null);
    setFormData({
      name: '',
      logoUrl: '',
      tier: 'Official Partner',
      websiteUrl: '',
      displayOrder: sponsors.length + 1,
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Sponsor) => {
    setSelectedSponsor(s);
    setFormData({
      name: s.name,
      logoUrl: s.logoUrl,
      tier: s.tier,
      websiteUrl: s.websiteUrl,
      displayOrder: s.displayOrder,
      isActive: s.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedSponsor ? `/api/admin/sponsors/${selectedSponsor.id}` : '/api/admin/sponsors';
      const method = selectedSponsor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save sponsor');

      showToast(selectedSponsor ? 'Sponsor updated.' : 'Sponsor added.');
      setIsFormOpen(false);
      loadSponsors();
    } catch (err: any) {
      alert(err.message || 'Error saving sponsor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSponsor) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/sponsors/${selectedSponsor.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete sponsor');

      showToast('Sponsor removed.');
      setIsDeleteOpen(false);
      loadSponsors();
    } catch (err: any) {
      alert(err.message || 'Error deleting sponsor');
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
            Sponsors & Brand Partners
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage verified team sponsors. If empty, the public section remains gracefully hidden.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="divide-y divide-zinc-800/80">
          {sponsors.length > 0 ? (
            sponsors.map((s) => (
              <div key={s.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-orange-400 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{s.name}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">{s.tier}</span>
                    {s.websiteUrl && (
                      <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-400 hover:underline flex items-center gap-1 mt-0.5">
                        <span>{s.websiteUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${s.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSponsor(s);
                        setIsDeleteOpen(true);
                      }}
                      className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              No sponsors configured yet.
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Sponsor / Partner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Zennara"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Tier / Category *</label>
                <input
                  type="text"
                  required
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  placeholder="e.g. Official Kit Partner, Associate Sponsor"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Official Website URL</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveSponsor"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="isActiveSponsor" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Active (Visible on public site)
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
                  <span>Save Partner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Sponsor?"
        message={`Are you sure you want to remove ${selectedSponsor?.name}?`}
        confirmLabel="Delete Partner"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
