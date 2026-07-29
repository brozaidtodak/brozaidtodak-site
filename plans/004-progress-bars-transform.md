# 004 — Buang `transition: all`; animasi bar guna `scaleX`, bukan `width`

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: HIGH
- **Category**: 5. Performance
- **Estimated scope**: 4 fail, ~8 baris

## Problem

Empat bar kemajuan guna utiliti Tailwind `transition-all` sambil menganimasi `width` atau `height`:

```jsx
/* src/pages/ProjectDetail.jsx:126 — semasa */
<div className="h-full bg-gold rounded-full transition-all"
  style={{ width: `${project.progress_percent}%` }} />

/* src/pages/SiteRoadmap.jsx:197 — semasa */
<div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />

/* src/components/Projects.jsx:169 — semasa */
<div className="h-full bg-gold rounded-full transition-all" style={{ width: `${p.progress_percent}%` }} />

/* src/components/ServisDemo.jsx:268 — semasa */
<div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${(b / max) * 100}%`, ... }} />
```

Dua masalah, kedua-duanya dari AUDIT §5:

1. **`transition: all` sentiasa satu penemuan** — ia menganimasi setiap sifat yang berubah, termasuk yang tak dijangka, dan di luar GPU.
2. **`width`/`height` mencetus layout + paint + composite** setiap frame. Hanya `transform` dan `opacity` patut dianimasi.

## Target

Bar mengisi dengan `transform: scaleX()` dari tepi kiri (atau `scaleY()` dari bawah untuk bar menegak), dengan tempoh dan easing eksplisit:

```jsx
/* target — bar mendatar */
<div className="h-full bg-gold rounded-full origin-left transition-transform duration-500 ease-[var(--ease-out)]"
  style={{ transform: `scaleX(${(project.progress_percent || 0) / 100})` }} />
```

```jsx
/* target — bar menegak (ServisDemo) */
<div key={i} className="flex-1 rounded-t origin-bottom transition-transform duration-500 ease-[var(--ease-out)]"
  style={{ transform: `scaleY(${b / max})`, height: '100%' }} />
```

Nota penting: elemen bar mesti mengisi bekasnya (`width: 100%` untuk mendatar) supaya `scaleX` mengukur dari lebar penuh. Bekas luar sudah ada `overflow-hidden` di setiap tapak, jadi sudut bulat kekal terpotong kemas.

## Repo conventions to follow

- Site ini guna Tailwind v4 dengan token dalam `@theme`. Rujuk token easing guna sintaks kurungan siku: `ease-[var(--ease-out)]` (token dicipta dalam pelan **001** — jalankan 001 dahulu).
- Tempoh 500ms sesuai di sini: AUDIT §2 benarkan lebih panjang untuk motion penjelasan/marketing, dan bar ini muncul sekali semasa tatal, bukan interaksi kekerapan tinggi.

## Steps

1. `src/pages/ProjectDetail.jsx:126` — tukar `transition-all` → `origin-left transition-transform duration-500 ease-[var(--ease-out)]`, tambah `w-full`, dan tukar `style` dari `width` ke `transform: scaleX(...)` seperti blok target.
2. `src/pages/SiteRoadmap.jsx:197` — perubahan sama.
3. `src/components/Projects.jsx:169` — perubahan sama.
4. `src/components/ServisDemo.jsx:268` — guna varian menegak: `origin-bottom`, `scaleY`, `height: '100%'`.
5. Pastikan setiap nilai dibahagi 100 dan dilindungi `|| 0` supaya `undefined` tidak menghasilkan `scaleX(NaN)`.

## Boundaries

- JANGAN ubah warna, jejari bulat, atau susun atur bekas.
- JANGAN buang `overflow-hidden` pada bekas luar — ia yang jaga sudut bulat.
- JANGAN sentuh bar/meter lain yang tidak disenaraikan di atas.
- Jalankan pelan **001** dahulu (token `--ease-out` mesti wujud), atau ganti dengan literal `cubic-bezier(0.23,1,0.32,1)`.

## Verification

- **Mechanical**: `npm run build` lulus. `grep -rn "transition-all" src/` mesti pulang **0 padanan**.
- **Feel check**: buka `/portfolio` dan halaman projek.
  - Bar mengisi dari **kiri**, bukan mengembang dari tengah atau melompat.
  - DevTools → Performance, rakam semasa bar mengisi: tiada baris **Layout** berulang sepanjang animasi (sebelum ini ada setiap frame).
  - Bar `ServisDemo` tumbuh dari **bawah**, bukan atas.
- **Done when**: 0 padanan `transition-all` dalam `src/`, bar beranimasi guna transform, tiada layout thrash dalam rakaman Performance.
