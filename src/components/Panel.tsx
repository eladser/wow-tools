import type { ReactNode } from 'react';

// In-game window frame: gold edge plus four corner brackets.
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`codex-panel rounded-sm ${className}`}>
      <span className="corner-bracket border-t border-l top-1 left-1" />
      <span className="corner-bracket border-t border-r top-1 right-1" />
      <span className="corner-bracket border-b border-l bottom-1 left-1" />
      <span className="corner-bracket border-b border-r bottom-1 right-1" />
      {children}
    </div>
  );
}
