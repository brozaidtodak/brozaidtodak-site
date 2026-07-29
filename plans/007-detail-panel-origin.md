# 007 — Panel Perjalanan: masuk dari arah ia melekat, dan boleh diganggu

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: MEDIUM
- **Category**: 3. Physicality & origin + 4. Interruptibility
- **Estimated scope**: 2 fail (`src/pages/Journey.jsx`, `src/index.css`), ~12 baris

## Problem

```jsx
/* src/pages/Journey.jsx:231-235 — semasa */
<div className="fixed z-30 inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-96
                ... animate-[slideup_.25s_ease]">
```

```css
/* src/index.css:165-168 — semasa */
@keyframes slideup {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
```

Tiga masalah:

1. **Arah bercanggah dengan kedudukan.** Pada desktop panel melekat pada tepi **kanan** (`md:right-0 md:w-96`) tetapi animasinya bergerak **menegak**. AUDIT §3: UI yang berhubung secara ruang mesti bergerak dari tempat asalnya. Panel kanan mesti masuk dari kanan.
2. **Keyframe tidak boleh diganggu.** `@keyframes` sentiasa bermula semula dari sifar. Panel ini dibuka dengan mengklik nod pokok — klik nod lain semasa ia masih beranimasi, animasi tersentak semula dari awal. AUDIT §4: apa-apa yang boleh dicetus berturut-turut mesti guna transisi.
3. **`ease` kosong pada kemasukan.** AUDIT §2: masuk/keluar → `ease-out`.

## Target

Guna transisi (boleh retarget di tengah jalan) dengan arah mengikut breakpoint, dan anjakan berasaskan **peratus diri sendiri** supaya tiada offset piksel keras:

```css
/* target — src/index.css */
.detail-panel {
  transform: translateY(100%);
  opacity: 0;
  transition: transform .28s var(--ease-out), opacity .28s var(--ease-out);
}
.detail-panel.is-open { transform: translateY(0); opacity: 1; }

@media (min-width: 768px) {
  .detail-panel { transform: translateX(100%); }
  .detail-panel.is-open { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .detail-panel { transition: opacity .2s ease; transform: none; }
  .detail-panel.is-open { transform: none; }
}
```

```jsx
/* target — src/pages/Journey.jsx */
const [shown, setShown] = useState(false)
useEffect(() => {
  const id = requestAnimationFrame(() => setShown(true))
  return () => cancelAnimationFrame(id)
}, [])
...
<div className={`detail-panel fixed z-30 ... ${shown ? 'is-open' : ''}`}>
```

Tempoh 280ms berada dalam julat drawer AUDIT §2 (200–500ms) dan kekal pantas untuk panel yang dibuka berulang kali.

## Repo conventions to follow

- Repo ini sudah guna corak "set kelas selepas mount" untuk mengelak keadaan awal terlepas — lihat pengendalian `.reveal`/`.hero-sub` di `src/pages/Landing.jsx:112-115` yang guna `fromTo` eksplisit atas sebab yang sama.
- Setiap kumpulan animasi dalam `src/index.css` diikuti blok `@media (prefers-reduced-motion: reduce)` sendiri (baris 110, 154, 242, 265). Ikut corak itu — jangan bergantung pada blok orang lain.
- Kekalkan komen seksyen bertajuk Melayu.

## Steps

1. `src/index.css` — tambah blok `.detail-panel` seperti target, letak dalam seksyen "INTERAKSI SETIAP SECTION"; buang `@keyframes slideup` (baris 165-168) jika tiada pengguna lain (sahkan dengan `grep -rn "slideup" src/`).
2. `src/pages/Journey.jsx:231` — buang `animate-[slideup_.25s_ease]`, tambah kelas `detail-panel` dan togol `is-open`.
3. `src/pages/Journey.jsx` — tambah state `shown` + `useEffect` rAF seperti target supaya transisi benar-benar berlaku (menetapkan kelas dalam render yang sama tidak akan beranimasi).
4. Sahkan panel masih ditutup betul — bila `node` bertukar, `shown` mesti kekal `true` supaya panel meluncur sekali sahaja, bukan berkelip setiap tukar nod.

## Boundaries

- JANGAN ubah susun atur, warna, bayang, atau kandungan panel.
- JANGAN ubah logik buka/tutup di komponen induk.
- JANGAN buang `@keyframes slideup` sebelum `grep` sahkan tiada pengguna lain.
- Jalankan pelan **001** dahulu untuk token `--ease-out`.

## Verification

- **Mechanical**: `npm run build` lulus. `grep -rn "slideup" src/` pulang 0 (atau hanya pengguna sah yang dikenal pasti).
- **Feel check**:
  - Desktop (lebar > 768px): klik nod pokok — panel meluncur masuk **dari tepi kanan**.
  - Mudah alih (< 768px): panel meluncur **dari bawah**.
  - Klik beberapa nod berturut-turut dengan cepat: panel **tidak** tersentak semula dari sifar setiap kali.
  - DevTools → Animations, main pada 10%: pergerakan bermula pantas kemudian perlahan (ease-out), bukan sebaliknya.
  - Reduced-motion aktif: panel muncul dengan fade sahaja, tiada luncuran.
- **Done when**: arah masuk sepadan dengan tepi tempat panel melekat pada kedua-dua breakpoint, dan klik pantas berturut-turut tidak memulakan semula animasi.
