'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Newspaper, Check, Loader2, Eye, EyeOff } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  author: string;
  status: string;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '/brand/post-journey-players.png',
    category: 'Team News',
    author: 'Nawabs Media',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
  });

  const loadArticles = async () => {
    try {
      const res = await fetch(`/api/admin/news?status=${statusFilter}`);
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '/brand/post-journey-players.png',
      category: 'Team News',
      author: 'Nawabs Media',
      status: 'DRAFT',
      seoTitle: '',
      seoDescription: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setSelectedArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      coverImageUrl: art.coverImageUrl,
      category: art.category,
      author: art.author,
      status: art.status,
      seoTitle: art.seoTitle,
      seoDescription: art.seoDescription,
    });
    setIsFormOpen(true);
  };

  const handleTogglePublish = async (art: Article) => {
    const nextStatus = art.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/news/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...art, status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      showToast(nextStatus === 'PUBLISHED' ? 'Article published to live site!' : 'Article reverted to draft.');
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Status change failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = selectedArticle ? `/api/admin/news/${selectedArticle.id}` : '/api/admin/news';
      const method = selectedArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save article');

      showToast(selectedArticle ? 'Article updated.' : 'New article created.');
      setIsFormOpen(false);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/news/${selectedArticle.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');

      showToast('Article deleted.');
      setIsDeleteOpen(false);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Error deleting article');
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
            News & Articles CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Write announcements, match recaps, and manage Draft / Published workflow
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
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
            <option value="all">All Stories</option>
            <option value="PUBLISHED">Published Live Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>
        </div>
        <span className="text-xs font-mono text-zinc-500">{articles.length} articles</span>
      </div>

      {/* Articles Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Title & Excerpt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                          <img src={art.coverImageUrl} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block text-sm leading-snug">
                            {art.title}
                          </span>
                          <span className="text-[11px] text-zinc-500 line-clamp-1">{art.excerpt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">
                      {art.author}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase transition-colors ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {art.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{art.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArticle(art);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                    {loading ? 'Loading articles...' : 'No articles found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Article Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedArticle ? 'Edit Article' : 'Compose New Article'}
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
                <label className="text-xs font-semibold text-zinc-300 uppercase">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Headline..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Season Review, Roster, Match Recap"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 uppercase">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Publishing Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="DRAFT">DRAFT (Hidden from public site)</option>
                  <option value="PUBLISHED">PUBLISHED (Live on public site)</option>
                </select>
              </div>

              <ImageUpload
                value={formData.coverImageUrl}
                onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                label="Cover Image"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short lead paragraph summarizing the story..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 uppercase">Article Content (Full Text) *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full editorial body here. Separate paragraphs with a blank line..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-sans"
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
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Article?"
        message={`Are you sure you want to delete "${selectedArticle?.title}"?`}
        confirmLabel="Delete Article"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={saving}
      />
    </div>
  );
}
