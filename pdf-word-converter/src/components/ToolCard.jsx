function ToolCard({ icon, title, description, onClick }) {
  return (
    <div className="tool-card" onClick={onClick}>
      <div className="tool-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button>Convert Now →</button>
    </div>
  );
}

export default ToolCard;