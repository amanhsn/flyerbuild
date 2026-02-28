import { useState } from "react";
import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { cn } from "../../lib/utils";

export const FileUploadZone = ({
  files = [], onUpload, onDelete, accept = "image/*,.pdf",
  maxFiles = 20, disabled = false, label,
}) => {
  const { t } = useLang();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled && e.dataTransfer.files.length) {
      onUpload?.(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length) onUpload?.(e.target.files);
  };

  return (
    <div>
      {label && (
        <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-2">
          {label}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg p-6 text-center transition-all border-2 border-dashed",
          dragOver ? "border-primary bg-primary-glow" : "border-border bg-bg-overlay",
          disabled ? "cursor-default opacity-50" : "cursor-pointer"
        )}
        onClick={() => {
          if (!disabled) document.getElementById("file-upload-input")?.click();
        }}
      >
        <Icon n="upload" size={24} color="var(--text-muted)" />
        <div className="font-mono text-sm text-text-secondary mt-2">
          {t("dropFiles")}
        </div>
        <div className="font-mono text-xs text-text-muted mt-1">
          {files.length} / {maxFiles} files
        </div>
        <input
          id="file-upload-input"
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-bg-raised border border-border rounded-sm">
              <Icon n="file" size={14} color="var(--text-muted)" />
              <span className="font-mono text-xs text-text-secondary flex-1">{f.name}</span>
              {!disabled && onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                  className="bg-transparent border-none cursor-pointer p-0.5"
                >
                  <Icon n="trash" size={12} color="var(--red)" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
