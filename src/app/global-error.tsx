'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#080809] text-white min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-[#121214] border border-white/10">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#FF5E00]/20 border border-[#FF5E00]/40 flex items-center justify-center text-[#FF5E00] font-bold text-xl">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">NIZAM NAWABS</h1>
            <p className="text-sm text-zinc-400">An unexpected system interruption occurred. Please retry.</p>
            {error.digest && (
              <p className="text-[10px] text-zinc-600 font-mono">CODE: {error.digest}</p>
            )}
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg bg-[#FF5E00] hover:bg-[#FF7324] text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            RELOAD APPLICATION
          </button>
        </div>
      </body>
    </html>
  );
}
