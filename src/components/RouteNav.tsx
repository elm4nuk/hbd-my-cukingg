import type { SceneId } from '../config/birthday'
import { PixelIcon, type PixelIconName } from './PixelIcon'

const sceneIcon: Record<SceneId, PixelIconName> = {
  opening: 'train',
  hub: 'home',
  gallery: 'images',
  quest: 'flag',
  video: 'video',
  gift: 'gift',
  finale: 'cake',
}

type Props = {
  scenes: { id: SceneId; short: string; label: string }[]
  current: SceneId
  visited: SceneId[]
  onGo: (scene: SceneId) => void
}

/** Rute perjalanan di topbar: ikon pixel per stasiun, aktif = ubin pink, sudah dikunjungi = titik. */
export function RouteNav({ scenes, current, visited, onGo }: Props) {
  return (
    <nav className="route-nav" aria-label="Rute perjalanan">
      <ol>
        {scenes.map(scene => {
          const active = scene.id === current
          return (
            <li key={scene.id}>
              <button
                className={`route-nav__stop ${active ? 'is-active' : ''} ${visited.includes(scene.id) ? 'is-visited' : ''}`}
                onClick={() => onGo(scene.id)}
                aria-label={`Buka ${scene.label}`}
                aria-current={active ? 'step' : undefined}
                title={scene.label}
              >
                <PixelIcon name={sceneIcon[scene.id]} />
                <small>{scene.label}</small>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
