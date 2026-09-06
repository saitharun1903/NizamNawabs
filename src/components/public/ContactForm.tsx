'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Player Scouting & Trials',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-brand-orange/10 border border-brand-orange/30 rounded-xl space-y-4">
        <CheckCircle2 className="w-12 h-12 text-brand-orange mx-auto" />
        <h4 className="font-display font-black text-2xl text-white tracking-tight uppercase">INQUIRY RECEIVED</h4>
        <p className="text-sm text-zinc-300 max-w-md mx-auto font-sans leading-relaxed">
          Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your correspondence has been logged for the Nizam Nawabs front office and communications team.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', category: 'Player Scouting & Trials', message: '' });
          }}
          className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:underline pt-2 inline-block"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-400">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Name"
            className="w-full bg-brand-black border border-surface-border rounded-lg px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-brand-orange font-sans"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-400">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@domain.com"
            className="w-full bg-brand-black border border-surface-border rounded-lg px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-brand-orange font-sans"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-400">
          Inquiry Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-brand-black border border-surface-border rounded-lg px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-brand-orange font-sans"
        >
          <option>Player Scouting & Trials</option>
          <option>Media & Press Accreditation</option>
          <option>Corporate Partnership & Sponsorship</option>
          <option>Ticketing & Arena Access</option>
          <option>General Correspondence</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-400">
          Message Details *
        </label>
        <textarea
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Provide detailed information regarding your inquiry..."
          className="w-full bg-brand-black border border-surface-border rounded-lg px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-brand-orange resize-none font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] bg-brand-orange hover:bg-brand-orangeHover text-white py-3.5 rounded-xl font-sans font-bold uppercase tracking-wider text-xs transition-all shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}</span>
      </button>
    </form>
  );
}
