# 008 — Buang CSS `.reveal` yang mati/diatasi GSAP

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: LOW
- **Category**: 7. Cohesion & tokens
- **Estimated scope**: 1 fail (`src/index.css`), ~6 baris

## Problem

```css
/* src/index.css:70-78 — semasa */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-in {
  opacity: 1;
  transform: translateY(0);
}
```

Dua bahagian daripada blok ini sudah mati:

1. **`.reveal-in` tidak pernah digunakan.** Disahkan: `grep -rn "reveal-in" src/` pulang **0 padanan** dalam JSX. Tiada kod menambah kelas itu.
2. **Baris `transition` diatasi sepenuhnya.** GSAP mengawal elemen `.reveal` melalui `gsap.fromTo()` pada `src/pages/Landing.jsx:118-124`, yang menulis gaya **inline** setiap frame. Transisi CSS tidak pernah menjalankan animasi sebenar.

Ia juga melanggar AUDIT §2 kalau ia berjalan (`ease` kosong + 800ms pada kemasukan), jadi meninggalkannya di situ menjemput orang menyalin corak yang salah.

**PENTING — satu bahagian blok ini load-bearing:** `opacity: 0` menghalang kandungan berkelip masuk sebelum JS dimuat (FOUC). Ia **mesti dikekalkan**.

## Target

```css
/* target */
/* opacity:0 dikekalkan — halang FOUC sebelum GSAP ambil alih.
   transform/transition dibuang: GSAP tulis gaya inline (Landing.jsx:118),
   dan .reveal-in tak pernah dipakai. */
.reveal { opacity: 0; }
```

Blok `@media (prefers-reduced-motion: reduce)` pada baris 110-114 kekal betul dan mesti **tidak** diubah — ia yang memulihkan `opacity: 1` bila JS memilih untuk tidak beranimasi.

## Repo conventions to follow

- Bila membuang kod, fail ini menerangkan **kenapa** dalam komen dan bukan sekadar memadam senyap — lihat komen `src/index.css:113` (`/* video diganti poster statik di komponen bila reduced-motion */`). Ikut tabiat itu.

## Steps

1. Sahkan semula sebelum memadam: jalankan `grep -rn "reveal-in" src/` dan sahkan **0 padanan**. Kalau ada padanan, BERHENTI — pelan ini tidak sah lagi.
2. `src/index.css:70-78` — ganti keseluruhan blok dengan versi target satu baris + komen.
3. Biarkan `src/index.css:110-114` (blok reduced-motion) sepenuhnya tidak berubah.

## Boundaries

- JANGAN buang `opacity: 0` — tanpanya kandungan berkelip sebelum GSAP jalan.
- JANGAN sentuh kod GSAP dalam `src/pages/Landing.jsx`.
- JANGAN buang kelas `.reveal` daripada mana-mana JSX — ia masih pemilih sasaran GSAP.

## Verification

- **Mechanical**: `npm run build` lulus. `grep -c "reveal-in" src/index.css` mesti `0`.
- **Feel check**: muat semula landing dengan cache dimatikan (Network → Disable cache), throttle ke "Slow 3G".
  - Semasa JS masih dimuat, kandungan seksyen bawah kekal **tidak kelihatan** — tiada kelipan teks tak bergaya.
  - Selepas JS dimuat, seksyen masih muncul dengan luncuran GSAP semasa tatal.
  - Reduced-motion aktif: semua kandungan kelihatan serta-merta.
- **Done when**: blok tinggal `opacity: 0` sahaja, dan kedua-dua laluan (biasa + reduced-motion) masih memaparkan kandungan.
