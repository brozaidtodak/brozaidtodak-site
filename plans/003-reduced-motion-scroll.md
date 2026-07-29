# 003 — Matikan `scroll-behavior: smooth` bawah reduced-motion

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: MEDIUM
- **Category**: 6. Accessibility
- **Estimated scope**: 1 fail (`src/index.css`), 1 baris

## Problem

```css
/* src/index.css:116 — semasa */
html { scroll-behavior: smooth; }
```

Global, tanpa gate. Setiap pautan anchor menatal secara animasi. Untuk pengguna dengan masalah vestibular, tatal-licin sepanjang halaman adalah **antara pencetus paling teruk** — lebih teruk daripada kesan hover yang site ni dah pun hormat.

Ia juga tidak konsisten: site ni hormat `prefers-reduced-motion` di **6 tempat lain** (`src/index.css:110`, `154`, `242`, `265`, dan cabang JS di `src/pages/Landing.jsx:55`, `90`). Yang ini sahaja terlepas.

## Target

```css
/* target */
html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

## Repo conventions to follow

- Fail ini letak blok reduced-motion **terus selepas** rule yang ia batalkan — lihat `src/index.css:110-114` (selepas `.reveal`/`.ember`) dan `src/index.css:265-267` (selepas `.scroll-wheel`). Ikut kedudukan yang sama: letak blok baru terus selepas baris 116.
- Guna `auto`, bukan `initial` — sepadan dengan gaya eksplisit fail ini.

## Steps

1. Dalam `src/index.css`, terus selepas baris 116 (`html { scroll-behavior: smooth; }`), tambah:
   ```css
   /* p2 — AUDIT §6: tatal-licin ialah pencetus vestibular; hormat reduced-motion
      macam 6 tempat lain dalam fail ni. */
   @media (prefers-reduced-motion: reduce) {
     html { scroll-behavior: auto; }
   }
   ```

## Boundaries

- JANGAN buang `scroll-behavior: smooth` untuk semua orang — ia kekal default.
- JANGAN sentuh blok reduced-motion lain.
- JANGAN tambah JS untuk ini — CSS mencukupi.

## Verification

- **Mechanical**: `npm run build` lulus.
- **Feel check**: DevTools → Rendering → `prefers-reduced-motion: reduce`. Klik pautan nav yang menuju anchor (contoh "Projek").
  - Halaman **melompat terus** ke seksyen, tiada tatal beranimasi.
  - Matikan semula tetapan: tatal licin kembali.
- **Done when**: `scroll-behavior: auto` muncul dalam blok reduced-motion, dan tatal melompat bila tetapan itu aktif.
