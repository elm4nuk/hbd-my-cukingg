import type { ReactNode } from 'react'

/** Bingkai layar fitur: eyebrow pixel + judul bagian + isi + footer aksi. */
export function SceneFrame({ eyebrow, title, children, footer }: { eyebrow: string; title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="scene" tabIndex={-1}>
      <header className="scene-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </header>
      <div className="scene-body">{children}</div>
      {footer && <footer className="scene-footer">{footer}</footer>}
    </main>
  )
}
