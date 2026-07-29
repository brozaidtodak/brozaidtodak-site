# 006 — Berhenti animasi `letter-spacing` pada hover garis masa

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: MEDIUM
- **Category**: 5. Performance
- **Estimated scope**: 1 fail (`src/index.css`), 2 baris

## Problem

```css
/* src/index.css:239-240 — semasa */
.journey-item .journey-year { transition: color .3s ease, letter-spacing .3s ease; }
.journey-item:hover .journey-year { color: var(--color-accent); letter-spacing: .26em; }
```

`letter-spacing` ialah sifat **layout**. Menganimasinya memaksa pelayan mengira semula susun atur teks setiap frame sepanjang 300ms, untuk setiap item garis masa yang dihover. AUDIT §5: animasikan `transform` dan `opacity` sahaja.

Ia juga menyebabkan teks **beralih kedudukan** semasa hover — tahun itu mengembang ke kanan dan menolak ruang sekelilingnya, yang membuat garis masa bergoyang halus.

## Target

Kekalkan perubahan warna (murah, dan itulah isyarat sebenar). Buang animasi jarak huruf. Kalau mahu kekalkan rasa "mengembang", guna `transform: scaleX()` yang tidak menyentuh layout — tetapi bagi label mono kecil begini, warna sahaja sudah memadai dan lebih kemas.

```css
/* target */
.journey-item .journey-year { transition: color .3s ease; }
.journey-item:hover .journey-year { color: var(--color-accent); }
```

## Repo conventions to follow

- Item garis masa yang sama sudah ada isyarat hover yang **betul** tepat di atasnya — `src/index.css:232-238` menganimasi `transform: scale(1.4)` dan `box-shadow` pada `.journey-dot`. Itu exemplar: titik yang membesar sudah menyampaikan hover; tahun tidak perlu bergerak juga.

## Steps

1. `src/index.css:239` — buang `, letter-spacing .3s ease` daripada senarai transisi.
2. `src/index.css:240` — buang `letter-spacing: .26em;` daripada rule hover.
3. Kalau pelan **002** sudah dijalankan, rule hover ini berada dalam blok `@media (hover: hover)` — buat suntingan di lokasi barunya.

## Boundaries

- JANGAN buang perubahan `color` — itu isyarat hover yang sah dan murah.
- JANGAN sentuh `.journey-dot` (baris 232-238); ia sudah betul.
- JANGAN ubah `letter-spacing` asas pada kelas Tailwind dalam JSX (contoh `tracking-[0.2em]`) — hanya animasi yang dibuang.

## Verification

- **Mechanical**: `npm run build` lulus. `grep -c "letter-spacing .3s" src/index.css` mesti `0`.
- **Feel check**: buka landing, tatal ke seksyen Perjalanan, hover setiap item.
  - Teks tahun bertukar oren **tanpa beralih kedudukan**; jiran-jirannya langsung tidak bergerak.
  - Titik masih membesar dan bercahaya seperti sebelum ini.
- **Done when**: tiada animasi `letter-spacing` tinggal, dan hover tidak menyebabkan teks beranjak.
