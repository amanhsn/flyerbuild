import { useRef, useCallback } from "react";
import { disp } from "../../styles/helpers";

export const BottomSheet = ({ open, onClose, title, children }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0 && sheetRef.current) {
      currentY.current = delta;
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (currentY.current > 100) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentY.current = 0;
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,.5)",
          animation: "fadeIn .2s ease both",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxHeight: "85vh",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          border: "1px solid var(--border)", borderBottom: "none",
          display: "flex", flexDirection: "column",
          animation: "fadeUp .25s ease both",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: "var(--border-bright)",
          }} />
        </div>

        {title && (
          <div style={{ padding: "4px 20px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={disp(16, 700)}>{title}</div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
