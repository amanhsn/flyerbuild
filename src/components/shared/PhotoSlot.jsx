import { useRef } from "react";
import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const PhotoSlot = ({ label, required = false, filled = false, imageData, onClick, onUpload, onDelete, disabled }) => {
  const fileRef = useRef(null);

  const handleClick = () => {
    if (disabled) return;
    if (filled) {
      onClick?.();
    } else {
      fileRef.current?.click();
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
    e.target.value = "";
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={cn("photo-slot relative", !filled && required && "missing-required")}
      onClick={handleClick}
    >
      {filled ? (
        <>
          <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg,var(--bg-overlay),var(--bg-elevated))" }}>
            {imageData ? (
              <img src={imageData} alt={label} className="w-full h-full object-cover" />
            ) : (
              <Icon n="camera" size={26} color="var(--text-muted)" />
            )}
          </div>
          <div className="font-mono text-xs text-text-secondary px-2.5 py-[7px] bg-bg-overlay flex justify-between">
            <span>{label}</span>
            <span className="text-text-green">&#10003;</span>
          </div>
          {!disabled && (
            <>
              <button
                onClick={handleDelete}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center border-none cursor-pointer hover:bg-black/80 transition-colors"
              >
                <Icon n="x" size={12} color="#fff" />
              </button>
              <div className="absolute bottom-8 right-1.5 w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center pointer-events-none">
                <Icon n="pen" size={11} color="#fff" />
              </div>
            </>
          )}
        </>
      ) : (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-2 m-2 rounded-lg"
          style={{
            border: `2px dashed ${required ? "var(--red-dim)" : "var(--border)"}`,
            background: `radial-gradient(circle at 50% 40%, ${required ? "var(--red-glow)" : "var(--bg-elevated)"} 0%, transparent 70%)`,
          }}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border",
              required
                ? "bg-red-glow border-red-dim"
                : "bg-bg-overlay border-border"
            )}
          >
            <Icon n="camera" size={16} color={required ? "var(--text-red)" : "var(--text-muted)"} />
          </div>
          <span
            className={cn(
              "font-mono text-[11px] text-center leading-snug max-w-[80%]",
              required ? "text-text-red" : "text-text-muted"
            )}
          >
            {label}{required && " *"}
          </span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
};
