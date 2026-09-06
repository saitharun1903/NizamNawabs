'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Navigation, Check, Loader2, ShieldAlert } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  isVisible: boolean;
  displayOrder: number;
}

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: '',
    url: '/',
    isExternal: false,
    isVisible: true,
    displayOrder: 0,
  });

  const loadNav = async () => {
    try {
      const res = await fetch('/api/admin/navigation');
      const data = await res.json();
      if (data.items) setNavItems(data.items);
    } catch (err) {
      console.error('Failed to load navigation items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNav();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setErrorMsg(null);
    setFormData({
      label: '',
      url: '/',
      isExternal: false,
      isVisible: true,
      displayOrder: navItems.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: NavItem) => {
    setSelectedItem(item);
    setErrorMsg(null);
    setFormData({
      label: item.label,
      url: item.url,
      isExternal: item.isExternal,
      isVisible: item.isVisible,
      displayOrder: item.displayOrder,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    try {
      const url = selectedItem ? `/api/admin/navigation/${selectedItem.id}` : '/api/admin/navigation';
      const method = selectedItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save navigation link');
      }

      showToast(selectedItem ? 'Navigation updated.' : 'Navigation link created.');
      setIsFormOpen(false);
      loadNav();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving navigation link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/navigation/${selectedItem.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete navigation item');

      showToast('Navigation link removed.');
      setIsDeleteOpen(false);
      loadNav();
    } catch (err: any) {
      alert(err.message || 'Error deleting navigation item');
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
            Navigation Menu Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure public website header navigation items and destinations
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Nav Link</span>
        </button>
      </div>

      {/* Critical System Route Protection Banner */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-0.5">
          <span className="font-semibold text-white block">System Route Protection Active:</span>
          <span>
            The /admin and /api routes are protected system namespaces and cannot be added to the public header navigation.
          </span>
        </div>
      </div>

      {/* List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Menu Label</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-4">Target Type</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {navItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">
                    {item.displayOrder}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {item.label}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-orange-400">
                    {item.url}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono">
                      {item.isExternal ? 'External' : 'Internal'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${item.isVisible ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {item.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. ROSTER"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Target URL *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g. /roster"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Display Order *</label>
                <input
                  type="number"
                  required
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExternal}
                    onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>External URL</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>Visible</span>
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
                  <span>Save Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Navigation Item?"
        message={`Are you sure you want to remove "${selectedItem?.label}" from the public navigation?`}
        confirmLabel="Delete Item"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
