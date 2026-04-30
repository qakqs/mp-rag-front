import { useState, useRef, useEffect } from 'react'

export default function ResizableTextarea({ value, onChange, onKeyDown, placeholder, inputRef }) {
  const textareaRef = useRef(null)
  const [height, setHeight] = useState(MIN_HEIGHT)
  const dragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  useEffect(() => {
    if (inputRef) inputRef.current = textareaRef.current
  }, [inputRef])

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragging.current = true
    startY.current = e.clientY
    startHeight.current = textareaRef.current?.offsetHeight || height

    const onMouseMove = (e) => {
      if (!dragging.current) return
      const delta = startY.current - e.clientY
      setHeight(clamp(startHeight.current + delta))
    }

    const onMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="flex-1 relative">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ height: `${height}px` }}
        className="w-full bg-pip-green-dim/10 border border-pip-border rounded-xl px-4 py-3 text-pip-text text-sm placeholder-pip-text-dim/50 resize-none outline-none focus:border-pip-green/50 focus:ring-1 focus:ring-pip-green/30 transition-colors block pip-input-glow"
      />
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-3 -translate-y-1/2 w-10 h-5 cursor-ns-resize flex items-center justify-center group z-10"
      >
        <div className="w-8 h-1.5 bg-pip-text-dim rounded group-hover:bg-pip-green transition-colors" />
      </div>
    </div>
  )
}

const MIN_HEIGHT = 44
const MAX_HEIGHT = 400

function clamp(value) {
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value))
}
