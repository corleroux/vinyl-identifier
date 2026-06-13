import { useEffect, useRef, useState } from 'react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export function LazyImage({ src, alt, fallback = '💿', className, ...props }: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <div ref={ref} className={className}>
      {inView && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
          {...props}
        />
      ) : (
        <span className="text-2xl" aria-hidden="true">
          {fallback}
        </span>
      )}
    </div>
  )
}
