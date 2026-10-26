// Kereta pixel art dari <rect> (1 unit = 1 "pixel"); crispEdges menjaga tepi tetap tajam saat diskalakan.
const C = { navy: '#14162e', ink: '#0b0c1e', panel: '#292044', lavender: '#bea0ff', lavDark: '#8a6fd1', pink: '#f18ac8', pinkDark: '#b85f97', cream: '#fff1d6', cyan: '#7fe3ff', gold: '#ffd76a' }

type R = [x: number, y: number, w: number, h: number, fill: string]

const body: R[] = [
  // Gerbong 1 (cream)
  [2, 10, 50, 3, C.lavender], [4, 13, 46, 19, C.cream], [4, 26, 46, 2, C.pink],
  [8, 16, 7, 6, C.panel], [19, 16, 7, 6, C.panel], [30, 16, 7, 6, C.panel], [41, 16, 6, 6, C.panel],
  // Gerbong 2 (pink)
  [56, 10, 52, 3, C.cream], [58, 13, 48, 19, C.pink], [58, 26, 48, 2, C.pinkDark],
  [62, 16, 8, 7, C.cyan], [74, 16, 8, 7, C.cyan], [86, 16, 8, 7, C.cyan], [98, 16, 5, 7, C.cyan],
  // Lokomotif (lavender)
  [112, 6, 20, 3, C.panel], [112, 9, 18, 9, C.lavDark], [115, 11, 9, 5, C.cyan],
  [112, 18, 40, 14, C.lavender], [130, 13, 22, 5, C.lavender], [136, 4, 6, 9, C.panel], [135, 3, 8, 2, C.ink],
  [150, 16, 8, 16, C.lavDark], [155, 19, 3, 3, C.gold], [112, 26, 46, 2, C.pink], [152, 30, 8, 3, C.ink],
  // Sambungan + rangka bawah
  [50, 27, 8, 2, C.ink], [106, 27, 8, 2, C.ink], [3, 32, 155, 2, C.ink],
]

const wheels = [10, 24, 38, 64, 78, 92, 118, 132, 146]

export function PixelTrain({ className = '' }: { className?: string }) {
  return (
    <svg className={`pixel-train ${className}`} viewBox="0 0 162 40" shapeRendering="crispEdges" role="img" aria-label="Kereta pixel Birthday Express">
      <g stroke={C.ink} strokeWidth={0.6}>
        {body.map(([x, y, w, h, fill], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />)}
      </g>
      <text x={27} y={24.5} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize={4} fill={C.panel}>· · ·</text>
      <g className="pixel-train__wheels">
        {wheels.map(x => (
          <g key={x}>
            <rect x={x - 3} y={33} width={7} height={6} fill={C.ink} />
            <rect x={x - 1} y={35} width={3} height={2} fill={C.lavender} />
          </g>
        ))}
      </g>
      <g className="pixel-train__smoke" fill={C.cream}>
        <rect x={137} y={-2} width={4} height={4} opacity={0.8} />
        <rect x={131} y={-6} width={5} height={5} opacity={0.55} />
        <rect x={124} y={-9} width={6} height={6} opacity={0.3} />
      </g>
    </svg>
  )
}
