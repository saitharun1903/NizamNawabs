'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Check, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

interface Milestone {
  id: string;
  yearLabel: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function AdminJourneyPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    yearLabel: '2025',
    title: '',
    description: '',
    category: 'Franchise',
    imageUrl: '',
    displayOrder: 0,
    isVisible: true,
  });

  const loadMilestones = async () => {
    try {
      const res = await fetch('/api/admin/journey');
      const data = await res.json();
      if (data.milestones) setMilestones(data.milestones);
    } catch (err) {
      console.error('Failed to load milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedMilestone(null);
    setFormData({
      yearLabel: '2025',
      title: '',
      description: '',
      category: 'Franchise',
      imageUrl: '/brand/post-journey-players.png',
      displayOrder: milestones.length + 1,
      isVisible: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Milestone) => {
    setSelectedMilestone(m);
    setFormData({
      yearLabel: m.yearLabel,
      title: m.title,
      description: m.description,
      category: m.category,
      imageUrl: m.imageUrl,
      displayOrder: m.displayOrder,
      isVisible: m.isVisible,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedMilestone ? `/api/admin/journey/${selectedMilestone.id}` : '/api/admin/journey';
      const method = selectedMilestone ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save milestone');

      showToast(selectedMilestone ? 'Milestone updated.' : 'New milestone added.');
      setIsFormOpen(false);
      loadMilestones();
    } catch (err: any) {
      alert(err.message || 'Error saving milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMilestone) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/journey/${selectedMilestone.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete milestone');

      showToast('Milestone deleted.');
      setIsDeleteOpen(false);
      loadMilestones();
    } catch (err: any) {
      alert(err.message || 'Error deleting milestone');
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
            Journey & History Milestones
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Chronicle franchise foundation, auctions, championship series, and player campaigns
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Milestones List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="divide-y divide-zinc-800/80">
          {milestones.map((m) => (
            <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start gap-4">
                {m.imageUrl && (
                  <div className="w-16 h-16 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                    <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-orange-400 text-sm">{m.yearLabel}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 uppercase font-mono">
                      {m.category}
                    </span>
                    {!m.isVisible && (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-mono">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-base leading-tight">{m.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  title="Edit Milestone"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMilestone(m);
                    setIsDeleteOpen(true);
                  }}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedMilestone ? 'Edit Timeline Milestone' : 'Add Milestone'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Year / Era Label *</label>
                  <input
                    type="text"
                    required
                    value={formData.yearLabel}
                    onChange={(e) => setFormData({ ...formData, yearLabel: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Origin, Silverware, Auction"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Milestone Photo / Asset"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Milestone Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isVisibleMilestone"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="isVisibleMilestone" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Visible on Public Timeline
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
                  <span>Save Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Milestone?"
        message={`Are you sure you want to delete "${selectedMilestone?.title}"?`}
        confirmLabel="Delete Milestone"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
