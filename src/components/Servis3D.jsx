import { Component, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// Demo 3D "4 lapisan sistem" untuk halaman /servis.
// Stack 4 slab (muka depan / dalaman / AI / data): seret untuk pusing,
// klik lapisan = stack terbuka + lapisan menyala oren, panel sisi
// terangkan kerja dia + pakej mana yang cover.
// Dimuat lazy dari Servis.jsx (three.js berat, jangan masuk bundle utama).
// Reduced-motion: tiada putaran auto, pergerakan hampir serta-merta.
// ============================================================

const ACCENT = '#ff4d00'
const SLAB = '#17171c'
const EDGE_IDLE = '#3a3a44'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- isi atas setiap slab (abstrak tapi bermakna) ---------- */

function MukaDepan() {
  // tiga skrin condong: katalog yang pelanggan tengok
  return (
    <>
      {[-0.95, 0, 0.95].map((x, i) => (
        <mesh key={i} position={[x, 0.34, 0.15]} rotation={[-0.28, 0, 0]}>
          <planeGeometry args={[0.78, 0.5]} />
          <meshStandardMaterial
            color={i === 0 ? ACCENT : '#e6e6ea'}
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  )
}

function Dalaman() {
  // carta bar kecil: order, stok, status
  const bars = [0.3, 0.52, 0.38, 0.72, 0.46]
  return (
    <>
      {bars.map((h, i) => (
        <mesh key={i} position={[-0.9 + i * 0.45, 0.08 + h / 2, 0.15]}>
          <boxGeometry args={[0.24, h, 0.24]} />
          <meshStandardMaterial color={i === 3 ? ACCENT : '#c7c7cf'} roughness={0.8} />
        </mesh>
      ))}
    </>
  )
}

function Automasi({ still }) {
  // nod AI + gelang orbit (pusing perlahan, statik bila reduced-motion)
  const ring = useRef()
  useFrame((_, dt) => {
    if (ring.current && !still) ring.current.rotation.z += dt * 0.5
  })
  return (
    <group position={[0, 0.46, 0]}>
      <mesh>
        <sphereGeometry args={[0.21, 32, 32]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
      <group ref={ring} rotation={[Math.PI / 2.4, 0, 0.4]}>
        <mesh>
          <torusGeometry args={[0.44, 0.014, 12, 72]} />
          <meshStandardMaterial color="#9a9aa4" roughness={0.5} />
        </mesh>
        <mesh position={[0.44, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#e6e6ea" />
        </mesh>
      </group>
    </group>
  )
}

function Data() {
  // silinder bertindan: satu pangkalan data
  return (
    <group position={[0, 0, 0.05]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.17 + i * 0.19, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.13, 40]} />
          <meshStandardMaterial color={i === 2 ? '#d9d9de' : '#b7b7c0'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

const CONTENT = [MukaDepan, Dalaman, Automasi, Data]

/* ---------- satu lapisan ---------- */

function Layer({ idx, targetY, active, hovered, setHovered, onSelect, still }) {
  const ref = useRef()
  const lambda = still ? 30 : 6
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, lambda, dt)
    }
  })
  const isActive = active === idx
  const edge = isActive ? ACCENT : hovered === idx ? '#ffffff' : EDGE_IDLE
  const Inner = CONTENT[idx]
  return (
    <group
      ref={ref}
      position={[0, targetY, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(idx) }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(idx); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = '' }}
    >
      <mesh>
        <boxGeometry args={[3.2, 0.16, 2.2]} />
        <meshStandardMaterial
          color={SLAB}
          roughness={0.85}
          metalness={0.1}
          emissive={isActive ? ACCENT : '#000000'}
          emissiveIntensity={isActive ? 0.14 : 0}
        />
        <Edges color={edge} />
      </mesh>
      <Inner still={still} />
    </group>
  )
}

/* ---------- tiang penyambung di empat penjuru ---------- */

function Connectors({ gap, still }) {
  const ref = useRef()
  const lambda = still ? 30 : 6
  useFrame((_, dt) => {
    if (!ref.current) return
    const h = gap * 3 + 0.4
    ref.current.children.forEach((m) => {
      m.scale.y = THREE.MathUtils.damp(m.scale.y, h, lambda, dt)
    })
  })
  return (
    <group ref={ref}>
      {[[-1.35, -0.85], [1.35, -0.85], [-1.35, 0.85], [1.35, 0.85]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} scale={[1, gap * 3 + 0.4, 1]}>
          <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
          <meshStandardMaterial color="#2c2c34" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- kandungan Canvas ---------- */

function Scene({ active, hovered, setHovered, onSelect, still }) {
  const gap = active === null ? 0.62 : 0.95
  const { invalidate } = useThree()
  // pastikan frame terus dilukis bila state luar berubah (frameloop demand tak dipakai,
  // tapi invalidate murah dan selamat)
  useMemo(() => invalidate(), [active, hovered, invalidate])
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 7, 4]} intensity={1.3} />
      <pointLight position={[-3, -2, 3]} intensity={0.35} color={ACCENT} />
      <group rotation={[0, -0.4, 0]}>
        <Connectors gap={gap} still={still} />
        {[0, 1, 2, 3].map((i) => (
          <Layer
            key={i}
            idx={i}
            targetY={(1.5 - i) * gap}
            active={active}
            hovered={hovered}
            setHovered={setHovered}
            onSelect={onSelect}
            still={still}
          />
        ))}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.9}
        autoRotate={!still}
        autoRotateSpeed={0.7}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

/* ---------- error boundary: WebGL takde → fallback teks ---------- */

class GLBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

/* ---------- komponen utama (default export, dimuat lazy) ---------- */

export default function Servis3D({ t }) {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const still = useMemo(reduceMotion, [])
  const sel = active === null ? null : t.layers[active]

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-stretch">
      {/* model 3D */}
      <div className="relative rounded-2xl border border-white/12 bg-white/[0.02] overflow-hidden min-h-[380px] md:min-h-[460px]">
        <GLBoundary
          fallback={
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <p className="text-white/50 text-sm text-center max-w-xs">{t.fail}</p>
            </div>
          }
        >
          <Canvas
            camera={{ position: [4.4, 2.7, 4.8], fov: 36 }}
            dpr={[1, 1.75]}
            style={{ touchAction: 'pan-y' }}
            onPointerMissed={() => setActive(null)}
          >
            <Scene
              active={active}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={(i) => setActive((v) => (v === i ? null : i))}
              still={still}
            />
          </Canvas>
        </GLBoundary>
        <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 pointer-events-none select-none">
          {t.hint}
        </span>
      </div>

      {/* panel sisi */}
      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 md:p-6 flex flex-col">
        <div className="space-y-1.5">
          {t.layers.map((l, i) => (
            <button
              key={l.name}
              onClick={() => setActive((v) => (v === i ? null : i))}
              aria-pressed={active === i}
              className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                active === i
                  ? 'border-accent/60 bg-accent/[0.08]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <span className={`font-mono text-[11px] tracking-[0.18em] ${active === i ? 'text-accent' : 'text-white/40'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold flex-1">{l.name}</span>
              <span className={`text-lg leading-none transition-transform ${active === i ? 'rotate-45 text-accent' : 'text-white/35'}`} aria-hidden="true">+</span>
            </button>
          ))}
        </div>

        <div className="flex-1 mt-4 pt-4 border-t border-white/10" aria-live="polite">
          {sel ? (
            <>
              <p className="text-white/75 text-sm leading-relaxed">{sel.desc}</p>
              <p className="text-white/40 text-[11px] uppercase tracking-wider mt-4">{t.incl}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {sel.pakej.map((p) => (
                  <span key={p} className="font-mono text-[10px] tracking-[0.16em] text-accent border border-accent/40 rounded-full px-2.5 py-1">
                    {p}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-white/45 text-sm leading-relaxed">{t.idle}</p>
          )}
        </div>

        <a
          href="#pakej"
          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white/85 text-sm font-semibold hover:border-accent hover:text-accent transition"
        >
          {t.ctaPakej} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  )
}
