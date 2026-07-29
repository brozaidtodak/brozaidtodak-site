# 001 — Konsolidasi lengkung easing jadi token

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: LOW (tapi PRASYARAT untuk 002, 004, 006, 007)
- **Category**: 7. Cohesion & tokens
- **Estimated scope**: 1 fail (`src/index.css`), ~10 baris

## Problem

`cubic-bezier(.22,1,.36,1)` ditaip tangan **5 kali** dalam `src/index.css` (baris 138, 201, 213, 221, 256), plus tiga lengkung lain yang berdiri sendiri. Tiada token easing langsung, walaupun fail ini sudah ada blok `@theme` penuh dengan token warna/font.

Kesan: setiap pindaan easing perlu cari-ganti 5 tempat, dan lengkung baru cenderung ditaip "lebih kurang sama" — inilah punca lengkung tak sekata merentas komponen.

```css
/* src/index.css:138 — semasa */
.card-pad { transition: transform .4s cubic-bezier(.22,1,.36,1), ... }
/* src/index.css:201 — semasa */
.tilt { transition: transform .35s cubic-bezier(.22,1,.36,1); ... }
/* src/index.css:213, 221, 256 — corak sama berulang */
```

Satu lagi: `src/index.css:129` guna `cubic-bezier(.34,1.56,.64,1)` — nilai `1.56` bermakna **terlajak/melantun**, dipakai pada hover **setiap** butang. Personaliti site ni gelap-sinematik ("hutan malam + bara"), bukan playful. AUDIT §7: lengkung melantun disimpan untuk drag-to-dismiss dan detik main-main, bukan hover rutin.

## Target

Tambah token dalam blok `@theme` sedia ada (`src/index.css:3-29`), guna nilai **tepat** dari AUDIT.md:

```css
/* target — dalam @theme */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* ease-out tegas untuk UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* pergerakan atas skrin */
```

Kemudian ganti kelima-lima `cubic-bezier(.22,1,.36,1)` dengan `var(--ease-out)`, dan tukar lengkung melantun butang kepada `var(--ease-out)` juga.

Lengkung ini **dikekalkan** (ada sebab khusus, jangan sentuh):
- `src/index.css:171` `cubic-bezier(.36,.07,.19,.97)` — goyang gate kata laluan salah; lengkung goyang memang berbeza.
- `src/index.css:190` `cubic-bezier(.25,.6,.3,1)` — laju naik bara hero, seni-arah sengaja.

## Repo conventions to follow

- Token diisytihar dalam blok `@theme { }` di `src/index.css:3` (Tailwind v4). Ikut gaya komen sedia ada: komen Melayu ringkas menerangkan **kenapa**, seperti `src/index.css:4-8`.
- Nama token guna kebab-case dengan awalan jenis, seperti `--color-*` dan `--font-*` sedia ada.

## Steps

1. Dalam `src/index.css`, di dalam `@theme` (sebelum `}` pada baris 29), tambah:
   ```css
   /* p2 — token easing (AUDIT §2): satu lengkung dikongsi, bukan 5 salinan taip-tangan */
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   ```
2. Ganti setiap `cubic-bezier(.22,1,.36,1)` dengan `var(--ease-out)` pada baris 138, 201, 213, 221, 256.
3. Pada baris 129, tukar `cubic-bezier(.34,1.56,.64,1)` → `var(--ease-out)` (buang terlajak).

## Boundaries

- JANGAN sentuh `cubic-bezier(.36,.07,.19,.97)` (baris 171) atau `cubic-bezier(.25,.6,.3,1)` (baris 190).
- JANGAN ubah sebarang nilai `duration` dalam langkah ini — easing sahaja.
- JANGAN tambah dependency.
- Kalau langkah tak padan dengan kod yang dijumpai (kod dah berubah sejak commit dec5d14), BERHENTI dan lapor.

## Verification

- **Mechanical**: `npm run build` — mesti lulus tanpa ralat. `grep -c "cubic-bezier(.22,1,.36,1)" src/index.css` mesti pulang `0`.
- **Feel check**: buka landing, hover butang CTA hero.
  - Butang naik dan **berhenti** — tiada lantunan/terlajak melepasi kedudukan akhir.
  - Hover kad projek: naik licin, rasa sama pantas macam sebelum ni.
- **Done when**: 0 padanan `cubic-bezier(.22,1,.36,1)` dan `cubic-bezier(.34,1.56`, build lulus, hover tiada lantunan.
