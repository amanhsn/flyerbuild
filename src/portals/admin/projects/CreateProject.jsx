"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "../../../components/shared";
import { DataTable } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { parseAddressFile } from "../../../lib/parseExcel";

export const CreateProject = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [form, setForm] = useState({
    name: "",
    region: "",
    municipality: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  const handleFileUpload = async (fileList) => {
    const f = fileList instanceof FileList ? fileList[0] : fileList;
    if (!f) return;
    setUploading(true);
    setFile(f);
    try {
      const result = await parseAddressFile(f);
      setAddresses(result.addresses);
      setMetadata(result.metadata);
    } catch (err) {
      console.error("Failed to parse file:", err);
    }
    setUploading(false);
  };

  const toggleAddress = (index) => {
    setAddresses((prev) =>
      prev.map((a, i) => (i === index ? { ...a, selected: !a.selected } : a))
    );
  };

  const toggleAll = () => {
    const allSelected = addresses.every((a) => a.selected);
    setAddresses((prev) => prev.map((a) => ({ ...a, selected: !allSelected })));
  };

  const selectedCount = addresses.filter((a) => a.selected).length;
  const canSubmit = form.name.trim() && selectedCount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // In a real app this would POST to API — for now just navigate
    router.push("/admin/projects");
  };

  const columns = [
    {
      key: "selected",
      label: "",
      width: "40px",
      render: (r) => (
        <input
          type="checkbox"
          checked={r.selected}
          onChange={() => toggleAddress(addresses.indexOf(r))}
          onClick={(e) => e.stopPropagation()}
          className="accent-primary"
        />
      ),
    },
    { key: "tsg_id", label: "TSG ID", width: "100px" },
    { key: "street", label: "Street" },
    { key: "number", label: "Nr", width: "60px" },
    { key: "postal_code", label: "Postal", width: "80px" },
    { key: "city", label: "City", width: "100px" },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/projects")}
          className="flex items-center cursor-pointer"
          style={{ background: "none", border: "none", padding: 4 }}
        >
          <Icon n="chevR" size={18} color="var(--text-secondary)" style={{ transform: "rotate(180deg)" }} />
        </button>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>
          New Project
        </h1>
      </div>

      <div className="flex flex-col gap-5" style={{ maxWidth: 800 }}>
        {/* Project info */}
        <div className="flex flex-col gap-4" style={{ maxWidth: 500 }}>
          <Field label="Project Name" value={form.name} onChange={set("name")} placeholder="e.g. Wervik FTTH Rollout" />
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Region" value={form.region} onChange={set("region")} placeholder="West-Vlaanderen" />
            </div>
            <div className="flex-1">
              <Field label="Municipality" value={form.municipality} onChange={set("municipality")} placeholder="Wervik" />
            </div>
          </div>
        </div>

        {/* File upload */}
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-2">
            Upload Address List
          </div>
          <div
            className="rounded-lg p-6 text-center transition-all border-2 border-dashed border-border bg-bg-overlay cursor-pointer hover:border-primary"
            onClick={() => document.getElementById("project-file-input")?.click()}
          >
            <Icon n="upload" size={24} color="var(--text-muted)" />
            <div className="font-mono text-sm text-text-secondary mt-2">
              {uploading ? "Parsing file..." : file ? file.name : "Drop .xlsx, .xls, or .csv file"}
            </div>
            {metadata && (
              <div className="font-mono text-xs text-text-muted mt-1">
                {metadata.totalRows} rows, {metadata.eligibleRows} eligible addresses
              </div>
            )}
            <input
              id="project-file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Address preview */}
        {addresses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em]">
                Addresses ({selectedCount} / {addresses.length} selected)
              </div>
              <button
                onClick={toggleAll}
                className="font-mono text-xs text-primary cursor-pointer bg-transparent border-none"
              >
                {addresses.every((a) => a.selected) ? "Deselect All" : "Select All"}
              </button>
            </div>
            <DataTable
              columns={columns}
              rows={addresses}
              emptyMessage="No addresses found"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-2 pb-10">
          <button className="cta-btn secondary" onClick={() => router.push("/admin/projects")}>
            Cancel
          </button>
          <button
            className="toggle-btn primary active flex items-center gap-2"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{ padding: "10px 24px", opacity: canSubmit ? 1 : 0.5 }}
          >
            <Icon n="plus" size={16} color="#fff" />
            Create Project ({selectedCount} surveys)
          </button>
        </div>
      </div>
    </div>
  );
};
