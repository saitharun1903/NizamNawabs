'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PublicError Boundary Captured]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-black px-4 sm:px-6 lg:px-8 py-20 selection:bg-brand-orange selection:text-white">
      <div className="max-w-md w-full text-center space-y-8 p-8 sm:p-10 rounded-3xl bg-[#111114] border border-surface-border shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-orange/15 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-orange block">
            NIZAM NAWABS BASKETBALL
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            PLAY RESUMING SHORTLY
          </h2>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed">
            A temporary connection issue interrupted this view. Tap below to reload the hardwood data.
          </p>
          {error.digest && (
            <p className="text-[10px] text-zinc-600 font-mono tracking-wider pt-1">
              REF: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-sans font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-zinc-300 hover:text-white font-sans font-bold uppercase tracking-wider text-xs border border-surface-border transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
