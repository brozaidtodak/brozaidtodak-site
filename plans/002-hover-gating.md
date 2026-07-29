# 002 — Gate semua motion hover di belakang `@media (hover: hover)`

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: MEDIUM
- **Category**: 6. Accessibility
- **Estimated scope**: 1 fail (`src/index.css`), ~9 rule

## Problem

`src/index.css` ada **9 rule `:hover`** dan **sifar** gate `@media (hover: hover)`.

Pada peranti sentuh, tap mencetus keadaan `:hover` yang **melekat selepas jari diangkat** — kad kekal terangkat, butang kekal bercahaya, sampai pengguna tap tempat lain. Ini nampak macam bug pada telefon, dan landing ni memang direka untuk dilihat atas telefon.

```css
/* src/index.css:132 — semasa (tiada gate) */
.btn-pad:hover { transform: translateY(-3px); }
/* src/index.css:141 — semasa */
.card-pad:hover { transform: translateY(-6px); background: rgba(255,255,255,.055); }
/* src/index.css:210, 224, 235-240 — corak sama */
```

## Target

Motion hover (transform/scale/box-shadow) hanya aktif bila peranti benar-benar ada penuding tepat:

```css
/* target */
@media (hover: hover) and (pointer: fine) {
  .btn-pad:hover { transform: translateY(-3px); }
  .btn-pad.btn-accent:hover { box-shadow: 0 12px 34px rgba(255,77,0,.32); }
  .btn-pad.btn-light:hover { box-shadow: 0 12px 34px rgba(255,255,255,.18); }
  .card-pad:hover { transform: translateY(-6px); background: rgba(255,255,255,.055); }
  .tilt:hover::after { opacity: 1; }
  .stmt-accent:hover { text-shadow: 0 0 26px rgba(255,77,0,.45); }
  .stmt-accent:hover::after { transform: scaleX(1); }
  .journey-item:hover .journey-dot { transform: scale(1.4); background: var(--color-accent); box-shadow: 0 0 16px rgba(255,77,0,.6); }
  .journey-item:hover .journey-year { color: var(--color-accent); }
}
```

Perhatikan: `letter-spacing` **dibuang** dari rule terakhir — itu dikendalikan oleh pelan 006. Kalau 006 belum jalan, kekalkan buat masa ini dan biar 006 yang buang.

## Repo conventions to follow

- Fail ini sudah guna corak query-terkumpul untuk reduced-motion: lihat `src/index.css:242-246` yang kumpul banyak pemilih dalam satu `@media`. Ikut bentuk yang sama — satu blok `@media (hover: hover)`, bukan 9 blok berasingan.
- Kekalkan komen seksyen Melayu sedia ada (`/* ===== ... ===== */`).

## Steps

1. Dalam `src/index.css`, kekalkan **keadaan asas** (`.btn-pad { transition: ... }`, `.card-pad { transition: ... }`, dll) di luar media query — hanya rule `:hover` yang dipindah.
2. Cipta satu blok `@media (hover: hover) and (pointer: fine) { ... }` selepas seksyen "INTERAKSI SETIAP SECTION", dan pindahkan kesemua 9 rule `:hover` di atas ke dalamnya.
3. Pastikan blok `@media (prefers-reduced-motion: reduce)` sedia ada (baris 242-246 dan 154-157) kekal **tidak berubah** dan datang **selepas** blok hover baru, supaya keutamaan cascade kekal.

## Boundaries

- JANGAN buang mana-mana kesan hover — hanya gate ia.
- JANGAN sentuh `hover:` utiliti Tailwind dalam fail `.jsx` (contoh `hover:bg-white/[0.07]`) — itu perubahan warna, bukan motion, dan selamat atas sentuh.
- JANGAN ubah nilai transform/shadow.
- Kalau kod dah berubah sejak dec5d14, BERHENTI dan lapor.

## Verification

- **Mechanical**: `npm run build` lulus. `grep -c "hover: hover" src/index.css` mesti `>= 1`.
- **Feel check**: buka landing di DevTools mod peranti (iPhone), tap kad projek.
  - Kad **tidak** kekal terangkat selepas tap.
  - Atas desktop dengan tetikus: hover masih naik seperti biasa.
- **Done when**: semua 9 rule `:hover` motion berada dalam blok `@media (hover: hover) and (pointer: fine)`, tiada kesan hover melekat atas sentuh.
