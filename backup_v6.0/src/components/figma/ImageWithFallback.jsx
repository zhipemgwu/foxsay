import React, { useState, useEffect, useRef } from 'react'

export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false)
  const imgRef = useRef(null)

  const handleError = () => {
    setDidError(true)
  }

  // 超时兑底：图片加载超过8秒则显示占位图
  useEffect(() => {
    const img = imgRef.current
    if (!img || didError) return
    if (img.complete) return
    const timer = setTimeout(() => {
      if (!img.complete) setDidError(true)
    }, 8000)
    return () => clearTimeout(timer)
  }, [didError])

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`block ${className ?? ''}`}
      style={{
        ...style,
        background: 'linear-gradient(135deg, #453a60 0%, #574d72 50%, #453a60 100%)',
      }}
    >
      <div className="flex items-center justify-center w-full h-full" style={{ minHeight: 80 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
          <rect x="6" y="10" width="36" height="28" rx="4" stroke="#f5efe8" strokeWidth="2"/>
          <circle cx="18" cy="22" r="4" stroke="#f5efe8" strokeWidth="2"/>
          <path d="M6 32l10-10 8 8 6-4 12 8" stroke="#f5efe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  ) : (
    <img ref={imgRef} src={src} alt={alt} className={className} style={style} loading="lazy" {...rest} onError={handleError} />
  )
}
