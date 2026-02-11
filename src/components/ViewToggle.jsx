const VIEW_OPTIONS = [
  { id: "grid", label: "Griglia", icon: "bi bi-grid-3x3-gap" },
  { id: "list", label: "Lista", icon: "bi bi-list-ul" },
];

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="chip-row" style={{ gap: "20px", display: "flex" }}>
      {VIEW_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`chip-btn ${value === option.id ? "active" : ""}`}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          <i className={option.icon}></i>
          {option.label}
        </button>
      ))}
    </div>
  );
}
