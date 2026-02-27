export const ToggleButton = ({ label, variant = "primary", active, onClick, disabled }) => (
  <button
    className={`toggle-btn ${variant}${active ? " active" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
