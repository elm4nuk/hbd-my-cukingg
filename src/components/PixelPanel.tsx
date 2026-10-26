import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** Warna aksen border dalam. */
  tone?: 'lavender' | 'pink' | 'cream'
  as?: 'section' | 'div' | 'article' | 'aside'
}

/** Panel ungu gelap dengan border bertingkat, sudut pixel, dan bayangan tegas. */
export function PixelPanel({ children, tone = 'lavender', as: Tag = 'section', className = '', ...props }: Props) {
  return <Tag className={`pixel-panel pixel-panel--${tone} ${className}`} {...props}>{children}</Tag>
}
