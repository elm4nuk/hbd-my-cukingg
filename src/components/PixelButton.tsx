import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  /** `lg` = tombol START besar (opening). Default `md`. */
  size?: 'md' | 'lg'
}

/** Tombol pixel: frame bertakik, bayangan tegas, tekan 2px. Semua atribut <button> diteruskan. */
export function PixelButton({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }: Props) {
  return (
    <button type={type} className={`pixel-button pixel-button--${variant} pixel-button--${size} ${className}`} {...props}>
      <span className="pixel-button__label">{children}</span>
    </button>
  )
}
