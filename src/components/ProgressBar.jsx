export default function ProgressBar({ label }) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-pip-text-dim text-xs">{label}</p>
      )}
      <div className="w-full h-2 bg-pip-green-dim/30 rounded-full overflow-hidden border border-pip-border">
        <div
          className="h-full rounded-full bg-pip-green shadow-[0_0_8px_rgba(0,255,65,0.5)]"
          style={{
            width: '40%',
            animation: 'crt-progress-slide 1.2s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes crt-progress-slide {
          0%   { margin-left: 0; width: 30%; }
          50%  { margin-left: 40%; width: 40%; }
          100% { margin-left: 95%; width: 5%; }
        }
      `}</style>
    </div>
  )
}
