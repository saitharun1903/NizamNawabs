'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users, AlertCircle, Check, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  photoUrl: string;
  bio: string;
  height: string;
  nationality: string;
  ppg: number;
  rpg: number;
  apg: number;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    jerseyNumber: 0,
    position: 'Guard',
    photoUrl: '/brand/player-2.png',
    bio: '',
    height: '',
    nationality: 'India',
    ppg: 0,
    rpg: 0,
    apg: 0,
    isActive: true,
    displayOrder: 0,
  });

  const loadPlayers = async () => {
    try {
      const res = await fetch(`/api/admin/players?search=${encodeURIComponent(search)}&filter=${statusFilter}`);
      const data = await res.json();
      if (data.players) setPlayers(data.players);
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [search, statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedPlayer(null);
    setFormData({
      name: '',
      jerseyNumber: (players.length + 1) * 2,
      position: 'Guard',
      photoUrl: '/brand/player-2.png',
      bio: '',
      height: '6 ft 2 in',
      nationality: 'India',
      ppg: 15.0,
      rpg: 5.0,
      apg: 4.0,
      isActive: true,
      displayOrder: players.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setSelectedPlayer(player);
    setFormData({
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      position: player.position,
      photoUrl: player.photoUrl,
      bio: player.bio || '',
      height: player.height || '',
      nationality: player.nationality || 'India',
      ppg: player.ppg,
      rpg: player.rpg,
      apg: player.apg,
      isActive: player.isActive,
      displayOrder: player.displayOrder,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedPlayer ? `/api/admin/players/${selectedPlayer.id}` : '/api/admin/players';
      const method = selectedPlayer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save player');

      showToast(selectedPlayer ? 'Player updated successfully.' : 'Player added to squad.');
      setIsFormOpen(false);
      loadPlayers();
    } catch (err: any) {
      alert(err.message || 'Error saving player');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlayer) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/players/${selectedPlayer.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete player');

      showToast('Player deleted from squad.');
      setIsDeleteOpen(false);
      loadPlayers();
    } catch (err: any) {
      alert(err.message || 'Error deleting player');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
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
            Squad & Roster Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create, update, and manage official Nizam Nawabs players
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Player</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players by name..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Players</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Players Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Number</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Stats (PPG/RPG/APG)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {players.length > 0 ? (
                players.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block text-sm">{p.name}</span>
                          <span className="text-[11px] text-zinc-500">{p.height || 'N/A'} • {p.nationality}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      #{p.jerseyNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {p.position}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {p.ppg} / {p.rpg} / {p.apg}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          p.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Player"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlayer(p);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    {loading ? 'Loading roster records...' : 'No players found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedPlayer ? 'Edit Squad Player' : 'Add Player to Squad'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Player Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Jersey Number *</label>
                  <input
                    type="number"
                    required
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Position *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option>Point Guard</option>
                    <option>Shooting Guard</option>
                    <option>Small Forward</option>
                    <option>Power Forward</option>
                    <option>Center</option>
                    <option>Guard</option>
                    <option>Forward</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g. 6 ft 4 in"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Image Uploader Component */}
              <ImageUpload
                value={formData.photoUrl}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                label="Player Headshot / Photo"
              />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase font-mono">PPG</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ppg}
                    onChange={(e) => setFormData({ ...formData, ppg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase font-mono">RPG</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rpg}
                    onChange={(e) => setFormData({ ...formData, rpg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase font-mono">APG</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.apg}
                    onChange={(e) => setFormData({ ...formData, apg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Player Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Player profile, strengths, background..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Active Player (Visible on public roster)
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
                  <span>Save Player</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Safety Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Player from Roster?"
        message={`Are you sure you want to delete ${selectedPlayer?.name || 'this player'}? This action cannot be undone and will immediately remove them from the public website.`}
        confirmLabel="Delete Player"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
