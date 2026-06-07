export function AROverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect
            x="10"
            y="10"
            width="180"
            height="180"
            rx="8"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.8"
          />
          <line x1="10" y1="30" x2="10" y2="10" stroke="#3b82f6" strokeWidth="3" />
          <line x1="30" y1="10" x2="10" y2="10" stroke="#3b82f6" strokeWidth="3" />
          <line x1="190" y1="30" x2="190" y2="10" stroke="#3b82f6" strokeWidth="3" />
          <line x1="170" y1="10" x2="190" y2="10" stroke="#3b82f6" strokeWidth="3" />
          <line x1="10" y1="170" x2="10" y2="190" stroke="#3b82f6" strokeWidth="3" />
          <line x1="30" y1="190" x2="10" y2="190" stroke="#3b82f6" strokeWidth="3" />
          <line x1="190" y1="170" x2="190" y2="190" stroke="#3b82f6" strokeWidth="3" />
          <line x1="170" y1="190" x2="190" y2="190" stroke="#3b82f6" strokeWidth="3" />
          <text x="100" y="210" textAnchor="middle" fill="white" fontSize="12" opacity="0.8">
            Frame the vinyl here
          </text>
        </svg>
      </div>
    </div>
  )
}
