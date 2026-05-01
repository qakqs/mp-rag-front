import { useState, useEffect } from 'react'

export default function CrtOverlay() {
  const [phase, setPhase] = useState('cover')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('sweep'), 150)
    const t2 = setTimeout(() => setPhase('done'), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      {/* Permanent screen jitter */}
      <div className="fixed inset-0 z-[9997] pointer-events-none animate-jitter" />

      {/* Power-on sequence overlay */}
      {phase !== 'done' && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {/* Phase 1: black screen */}
          {phase === 'cover' && (
            <div className="absolute inset-0 bg-[#0a0b09]" />
          )}
          {/* Phase 2: dark curtain slides down, bottom edge = bright sweep line */}
          {phase === 'sweep' && (
            <div className="absolute inset-0 bg-[#0a0b09] crt-sweep-open" />
          )}
        </div>
      )}
    </>
  )
}
