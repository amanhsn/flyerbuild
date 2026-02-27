import { useState } from "react";
import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { mono } from "../../styles/helpers";

/**
 * FileUploadZone — drag-and-drop or click-to-upload area.
 * files: array of { name, size, uploadedAt }
 * onUpload: (files: FileList) => void
 * onDelete: (index) => void
 * accept: file accept string (e.g. "image/*,.pdf")
 * maxFiles: max number of uploads
 * disabled: boolean
 */
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
        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          {label}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: 24, textAlign: "center",
          background: dragOver ? "var(--primary-glow)" : "var(--bg-overlay)",
          transition: "all .2s", cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={() => {
          if (!disabled) document.getElementById("file-upload-input")?.click();
        }}
      >
        <Icon n="upload" size={24} color="var(--text-muted)" />
        <div style={mono(14, "var(--text-secondary)", { marginTop: 8 })}>
          {t("dropFiles")}
        </div>
        <div style={mono(12, "var(--text-muted)", { marginTop: 4 })}>
          {files.length} / {maxFiles} files
        </div>
        <input
          id="file-upload-input"
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          style={{ display: "none" }}
          disabled={disabled}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", background: "var(--bg-raised)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            }}>
              <Icon n="file" size={14} color="var(--text-muted)" />
              <span style={{ ...mono(12, "var(--text-secondary)"), flex: 1 }}>{f.name}</span>
              {!disabled && onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
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
