# 009 — Jawapan FAQ meluncur masuk, bukan meletup

- **Status**: TODO
- **Commit**: dec5d14
- **Severity**: LOW (peluang terlepas — penambahan, bukan pembetulan)
- **Category**: 8. Missed opportunities
- **Estimated scope**: 2 fail (`src/pages/Servis.jsx`, `src/pages/ServisPakej.jsx`), ~10 baris

## Problem

```jsx
/* src/pages/Servis.jsx:429-431 — semasa */
<span className={`text-accent text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
</button>
{open && <p className="text-white/70 text-sm leading-relaxed pb-5 -mt-1 max-w-prose">{a}</p>}
```

(Corak serupa pada `src/pages/ServisPakej.jsx:293-295`.)

Ikon `+` berputar dengan licin ke `×` — tetapi jawapannya **teleport** masuk dan keluar. Separuh interaksi beranimasi, separuh lagi tidak, jadi bahagian yang melompat itu terasa rosak berbanding ikon di sebelahnya.

AUDIT §8: perubahan keadaan yang melompat, di tempat transisi ringkas akan menghalang perubahan mengejut.

## Target

Gunakan grid-rows sifar-ke-satu — cara CSS moden menganimasi ketinggian **tanpa** mengetahui ketinggian kandungan dan **tanpa** menganimasi `height` (yang akan melanggar AUDIT §5):

```jsx
/* target */
<div
  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-out)] ${
    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
  }`}
>
  <div className="overflow-hidden">
    <p className="text-white/70 text-sm leading-relaxed pb-5 -mt-1 max-w-prose">{a}</p>
  </div>
</div>
```

200ms berada dalam julat dropdown AUDIT §2 (150–250ms).

Kandungan kini sentiasa ada dalam DOM. Itu **memperbaiki** kebolehcapaian juga — panel yang dipandu `aria-expanded` sepatutnya boleh dirujuk, bukan hilang terus.

## Repo conventions to follow

- Kedua-dua fail sudah guna kelas transisi Tailwind pada ikon (`transition-transform` pada `Servis.jsx:429`) — ikut gaya utiliti yang sama, jangan tambah CSS tersuai untuk ini.
- Rujuk token easing dengan `ease-[var(--ease-out)]` (token dari pelan **001**).

## Steps

1. `src/pages/Servis.jsx:431` — ganti `{open && <p ...>}` dengan pembungkus grid dua lapis seperti target. `<p>` dalaman kekal sama persis.
2. `src/pages/ServisPakej.jsx:295` — perubahan sama.
3. Selaraskan tempoh ikon dengan panel: pastikan ikon guna `duration-200` juga supaya kedua-dua bahagian interaksi selesai serentak.

## Boundaries

- JANGAN ubah teks soalan/jawapan atau susun atur butang.
- JANGAN buang `aria-expanded` atau tukar semantik butang.
- JANGAN animasi `height` secara langsung — guna corak grid-rows.
- JANGAN tambah dependency accordion.
- Jalankan pelan **001** dahulu untuk token `--ease-out`.

## Verification

- **Mechanical**: `npm run build` lulus.
- **Feel check**: buka `/servis`, klik satu soalan FAQ.
  - Jawapan **membuka** dengan licin; teks tidak melompat masuk.
  - Klik pantas buka-tutup-buka: panel berpatah balik dari kedudukan semasa, tidak tersentak ke sifar (transisi boleh diganggu — inilah sebabnya guna transisi, bukan keyframe).
  - Ikon `+` selesai berputar pada masa yang sama panel selesai membuka.
  - Pembaca skrin: butang masih melaporkan keadaan kembang/kuncup.
- **Done when**: kedua-dua fail FAQ beranimasi buka/tutup, dan togol pantas tidak menyebabkan sentakan.
