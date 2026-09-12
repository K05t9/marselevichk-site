export default function RetroWindow({ title = 'Окно', onClose, children }) {
  return (
    <div className="win">
      <div className="win-titlebar">
        <span>{title}</span>
        {onClose && (
          <span className="win-buttons">
            <button className="win-btn" onClick={onClose} title="Закрыть">
              ✕
            </button>
          </span>
        )}
      </div>
      <div className="win-body">{children}</div>
    </div>
  )
}
