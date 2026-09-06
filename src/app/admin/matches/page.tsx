'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Check, Loader2, Clock, MapPin } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  matchTime: string;
  venue: string;
  competition: string;
  status: string;
  ticketUrl: string;
  notes: string;
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    homeTeam: 'Nizam Nawabs',
    awayTeam: '',
    homeScore: '',
    awayScore: '',
    matchDate: new Date().toISOString().split('T')[0],
    matchTime: '19:00',
    venue: 'KVBR Indoor Stadium, Yousufguda, Hyderabad',
    competition: 'Telangana Pro Basketball League',
    status: 'Upcoming',
    ticketUrl: '',
    notes: '',
  });

  const loadMatches = async () => {
    try {
      const res = await fetch(`/api/admin/matches?status=${statusFilter}`);
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedMatch(null);
    setFormData({
      homeTeam: 'Nizam Nawabs',
      awayTeam: 'Secunderabad Strikers',
      homeScore: '',
      awayScore: '',
      matchDate: new Date().toISOString().split('T')[0],
      matchTime: '19:00',
      venue: 'KVBR Indoor Stadium, Yousufguda, Hyderabad',
      competition: 'Telangana Pro Basketball League',
      status: 'Upcoming',
      ticketUrl: '',
      notes: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Match) => {
    setSelectedMatch(m);
    setFormData({
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore !== null ? String(m.homeScore) : '',
      awayScore: m.awayScore !== null ? String(m.awayScore) : '',
      matchDate: m.matchDate,
      matchTime: m.matchTime,
      venue: m.venue,
      competition: m.competition,
      status: m.status,
      ticketUrl: m.ticketUrl || '',
      notes: m.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedMatch ? `/api/admin/matches/${selectedMatch.id}` : '/api/admin/matches';
      const method = selectedMatch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save match');

      showToast(selectedMatch ? 'Match updated successfully.' : 'New fixture scheduled.');
      setIsFormOpen(false);
      loadMatches();
    } catch (err: any) {
      alert(err.message || 'Error saving match');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMatch) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/matches/${selectedMatch.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete match');

      showToast('Match fixture deleted.');
      setIsDeleteOpen(false);
      loadMatches();
    } catch (err: any) {
      alert(err.message || 'Error deleting match');
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
            Matches & Fixtures
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage upcoming match tip-offs, venues, and live final box scores
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Fixture</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Matches</option>
            <option value="Upcoming">Upcoming Only</option>
            <option value="Completed">Completed Only</option>
          </select>
        </div>
        <span className="text-xs font-mono text-zinc-500">{matches.length} fixtures</span>
      </div>

      {/* Matches Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Fixture (Home vs Away)</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {matches.length > 0 ? (
                matches.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-white text-sm">
                          <span className={m.homeTeam.includes('Nizam') ? 'text-orange-400' : ''}>
                            {m.homeTeam}
                          </span>
                          <span className="text-zinc-500 font-mono px-1.5">vs</span>
                          <span className={m.awayTeam.includes('Nizam') ? 'text-orange-400' : ''}>
                            {m.awayTeam}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 font-mono">{m.competition}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {m.status === 'Completed' ? (
                        <span className="px-2 py-1 rounded bg-black border border-zinc-800 text-white">
                          {m.homeScore ?? '-'} : {m.awayScore ?? '-'}
                        </span>
                      ) : (
                        <span className="text-zinc-500">Upcoming</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{m.matchDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{m.matchTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="truncate block max-w-[180px] text-zinc-300" title={m.venue}>
                        {m.venue}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          m.status === 'Completed'
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Match"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMatch(m);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Match"
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
                    {loading ? 'Loading match records...' : 'No matches found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedMatch ? 'Edit Match Fixture / Scores' : 'Schedule New Match'}
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
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Home Team *</label>
                  <input
                    type="text"
                    required
                    value={formData.homeTeam}
                    onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Away Team *</label>
                  <input
                    type="text"
                    required
                    value={formData.awayTeam}
                    onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Status and Competition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Match Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Competition *</label>
                  <input
                    type="text"
                    required
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Scores (Active especially if Completed) */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-950/60 rounded border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase font-mono">
                    Home Score {formData.status === 'Completed' && '*'}
                  </label>
                  <input
                    type="number"
                    value={formData.homeScore}
                    onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    placeholder="e.g. 84"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase font-mono">
                    Away Score {formData.status === 'Completed' && '*'}
                  </label>
                  <input
                    type="number"
                    value={formData.awayScore}
                    onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    placeholder="e.g. 78"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Match Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Tip-off Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.matchTime}
                    onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                    placeholder="19:00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Venue Location *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Stadium, City, State"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Ticket Booking URL</label>
                <input
                  type="text"
                  value={formData.ticketUrl}
                  onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
                  placeholder="https://... or /contact"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Notes / Recap Highlights</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Match notes, key clutch plays, attendance..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
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
                  <span>Save Fixture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Match Fixture?"
        message={`Are you sure you want to delete the fixture between ${selectedMatch?.homeTeam} and ${selectedMatch?.awayTeam}?`}
        confirmLabel="Delete Match"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
