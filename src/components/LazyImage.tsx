import { useEffect, useRef, useState } from 'react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export function LazyImage({ src, alt, fallback = '💿', className, ...props }: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!src || !inView) {
    return (
      <div className={className}>
        <span className="text-2xl" aria-hidden="true">
          {fallback}
        </span>
      </div>
    )
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
      {...props}
    />
  )
}
