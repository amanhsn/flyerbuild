"use client"

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";

export const PhotoGallery = ({ slots, activeSlotKey, onClose, onAnnotate, onDelete }) => {
  const isMobile = useIsMobile();
  // slots: [{ key, label, imageData }] — only filled slots
  const [currentIdx, setCurrentIdx] = useState(() =>
    Math.max(0, slots.findIndex(s => s.key === activeSlotKey))
  );

  const current = slots[currentIdx];
  if (!current) return null;

  const goPrev = useCallback(() => {
    setCurrentIdx(i => (i > 0 ? i - 1 : slots.length - 1));
  }, [slots.length]);

  const goNext = useCallback(() => {
    setCurrentIdx(i => (i < slots.length - 1 ? i + 1 : 0));
  }, [slots.length]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/80"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-bg-base border border-border rounded-xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,.5)]",
          isMobile ? "mx-2 w-full max-h-[90vh]" : "max-w-[800px] w-full max-h-[85vh]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
          <span className="font-mono text-sm text-text-secondary">{current.label}</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">
              {currentIdx + 1} / {slots.length}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-elevated border border-border cursor-pointer"
            >
              <Icon n="x" size={14} color="var(--text-secondary)" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-0 p-4">
          {slots.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border-none cursor-pointer hover:bg-black/70 transition-colors"
            >
              <Icon n="chevL" size={16} color="#fff" />
            </button>
          )}

          <img
            src={current.imageData}
            alt={current.label}
            className="max-w-full max-h-full object-contain rounded-md"
          />

          {slots.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border-none cursor-pointer hover:bg-black/70 transition-colors"
            >
              <Icon n="chevR" size={16} color="#fff" />
            </button>
          )}
        </div>

        {/* Dots */}
        {slots.length > 1 && (
          <div className="flex justify-center gap-1.5 py-2">
            {slots.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  "w-2 h-2 rounded-full border-none cursor-pointer transition-colors",
                  i === currentIdx ? "bg-primary" : "bg-text-muted/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 justify-end p-3 border-t border-border shrink-0">
          <button
            onClick={() => onDelete(current.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border rounded-md font-mono text-xs text-text-secondary cursor-pointer mr-auto"
          >
            <Icon n="trash" size={13} color="var(--text-secondary)" />
            Delete
          </button>
          <button
            onClick={() => onAnnotate(current.key)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary border border-primary rounded-md font-mono text-xs font-bold text-white cursor-pointer"
          >
            <Icon n="pen" size={13} color="#fff" />
            Annotate
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
