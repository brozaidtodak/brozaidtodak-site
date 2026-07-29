# 005 — Buang lag 350ms pada tilt/magnetik + throttle mousemove dengan rAF

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: HIGH
- **Category**: 5. Performance + 4. Interruptibility
- **Estimated scope**: 2 fail (`src/pages/Landing.jsx`, `src/index.css`), ~30 baris

## Problem

Dua masalah bergabung jadi satu rasa yang salah.

**(a) Transisi melawan penjejakan kursor.** `.tilt` mengisytihar transisi 350ms pada `transform`:

```css
/* src/index.css:201 — semasa */
.tilt { transition: transform .35s cubic-bezier(.22,1,.36,1); transform-style: preserve-3d; will-change: transform; }
```

sambil pengendali `mousemove` menulis `transform` **setiap event**:

```jsx
/* src/pages/Landing.jsx:200-213 — semasa */
document.querySelectorAll('.tilt').forEach((el) => {
  const move = (e) => {
    ...
    el.style.setProperty('--mx', px * 100 + '%')
    el.style.setProperty('--my', py * 100 + '%')
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 7}deg) translateY(-5px)`
  }
  const leave = () => { el.style.transform = '' }
  el.addEventListener('mousemove', move)
  el.addEventListener('mouseleave', leave)
})
```

Setiap event memulakan semula transisi 350ms ke sasaran baharu, jadi kad **sentiasa memburu kursor dan tidak pernah sampai**. Tilt yang bagus mesti terasa seperti kad melekat di bawah jari.

**(b) Tiada throttle.** `mousemove` boleh menyala 120–1000Hz pada trackpad moden dan tetikus polling tinggi. Setiap event menulis tiga sifat gaya (`--mx`, `--my`, `transform`) — memaksa pengiraan semula gaya jauh lebih kerap daripada kadar frame.

Bukti bahawa repo ini **sudah tahu** cara betul: parallax tetikus pada `src/pages/Landing.jsx:66-79` guna gelung rAF dengan lerp dan menulis `transform` sekali sahaja setiap frame. Pengendali tilt/magnetik tidak ikut corak itu. `.magnetic` (`src/index.css:213`, `src/pages/Landing.jsx:216-222`) ada kecacatan sama.

## Target

Transisi hanya untuk **masuk dan keluar**, bukan semasa menjejak; dan satu tulisan gaya setiap frame.

```css
/* target — src/index.css */
.tilt { transform-style: preserve-3d; will-change: transform; }
/* transisi hanya bila kursor keluar (kembali ke pegun) */
.tilt:not(.tilt-tracking) { transition: transform .35s var(--ease-out); }
.magnetic:not(.magnetic-tracking) { transition: transform .25s var(--ease-out); }
```

```jsx
/* target — corak pengendali, guna semula untuk .tilt dan .magnetic */
let raf = null, pending = null
const move = (e) => {
  const r = el.getBoundingClientRect()
  pending = { px: (e.clientX - r.left) / r.width, py: (e.clientY - r.top) / r.height }
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = null
    const { px, py } = pending
    el.classList.add('tilt-tracking')
    el.style.setProperty('--mx', px * 100 + '%')
    el.style.setProperty('--my', py * 100 + '%')
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 7}deg) translateY(-5px)`
  })
}
const leave = () => {
  if (raf) { cancelAnimationFrame(raf); raf = null }
  el.classList.remove('tilt-tracking')   // transisi hidup semula → kembali licin
  el.style.transform = ''
}
```

## Repo conventions to follow

- **Exemplar untuk ditiru**: `src/pages/Landing.jsx:64-83` — gelung rRF parallax sedia ada. Ia simpan sasaran dalam pemboleh ubah, tulis dalam rAF, dan bersihkan dengan `cancelAnimationFrame` dalam fungsi pembersihan. Ikut struktur itu.
- Semua pengendali didaftar dalam `useEffect` yang menolak fungsi pembersihan ke array `cleanups` — kekalkan corak itu (`src/pages/Landing.jsx:208`, `222`).
- Effect ini sudah dijaga oleh `prefers-reduced-motion` dan `pointer: fine` pada `src/pages/Landing.jsx:158-159` — jangan tambah semakan berulang.

## Steps

1. `src/index.css:201` — buang `transition` dari `.tilt`; tambah rule berasingan `.tilt:not(.tilt-tracking) { transition: transform .35s var(--ease-out); }`.
2. `src/index.css:213` — perkara sama untuk `.magnetic` dengan kelas `.magnetic-tracking` dan tempoh `.25s`.
3. `src/pages/Landing.jsx:200-214` — tulis semula pengendali `.tilt` ikut corak rAF di atas; tambah/buang kelas `tilt-tracking`.
4. `src/pages/Landing.jsx:216-223` — perkara sama untuk `.magnetic` (transform ialah `translate(...)`, kelas `magnetic-tracking`).
5. Pastikan setiap `cleanups.push(...)` juga membatalkan rAF yang belum jalan.

## Boundaries

- JANGAN ubah nilai matematik tilt (7deg, translateY(-5px), pekali 0.3/0.45) — hanya **bila** ia ditulis.
- JANGAN sentuh gelung parallax pada baris 64-83; ia sudah betul.
- JANGAN tukar `.tilt::after` (kesan cahaya) — ia guna `--mx`/`--my` yang masih dikemas kini.
- JANGAN tambah dependency (tiada library spring).
- Jalankan pelan **001** dahulu untuk token `--ease-out`.

## Verification

- **Mechanical**: `npm run build` lulus. Tiada ralat konsol semasa gerak tetikus atas kad.
- **Feel check** (WAJIB — ini penemuan berasaskan rasa):
  - Gerakkan kursor perlahan-lahan melintasi kad stat. Kad mesti condong **serentak** dengan kursor, bukan meluncur di belakangnya.
  - Gerakkan kursor **laju** melintasi kad lalu keluar. Kad mesti kembali rata dengan licin (transisi masuk semula), bukan terhenti mendadak.
  - DevTools → Performance, rakam 3 saat sambil goyang kursor atas kad: bilangan **Recalculate Style** mesti turun mendadak berbanding sebelum (sasaran: ~60/saat, bukan ratusan).
- **Done when**: tilt menjejak kursor tanpa lag yang boleh dilihat, kembali rata dengan licin bila keluar, dan Recalculate Style terikat pada kadar frame.
