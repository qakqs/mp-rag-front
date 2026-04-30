import { useState, useEffect } from 'react'

export default function CrtOverlay({ showPowerOn = false }) {
  const [visible, setVisible] = useState(showPowerOn)

  useEffect(() => {
    if (!showPowerOn) return
    const t = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(t)
  }, [showPowerOn])

  if (!visible) {
    return (
      <div className="fixed inset-0 z-[9996] pointer-events-none crt-jitter" />
    )
  }

  return (
    <>
      {/* CRT power-on overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
        <div className="crt-power-on-line" />
        <div className="absolute inset-0 bg-pip-bg crt-power-on-open" />
        <div className="absolute inset-0 bg-pip-bg crt-flicker-in" />
      </div>
      {/* screen jitter */}
      <div className="fixed inset-0 z-[9996] pointer-events-none crt-jitter" />
    </>
  )
}
