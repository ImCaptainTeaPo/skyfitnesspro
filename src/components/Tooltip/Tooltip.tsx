import { createPortal } from 'react-dom';
import { useState } from 'react';

export function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [pos, setPos] = useState<{x:number, y:number} | null>(null);

  return (
    <div
      onMouseEnter={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPos(null)}
      className="relative inline-block"
    >
      {children}
      {pos &&
        createPortal(
          <div
            className="fixed bg-white border border-black text-black rounded-md px-3 py-1 text-base"
            style={{ top: pos.y + 10, left: pos.x + 10 }}
          >
            {text}
          </div>,
          document.body
        )}
    </div>
  );
}
