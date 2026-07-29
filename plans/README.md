# Pelan pembaikan animasi — brozaidtodak.com

Dijana oleh skill `improve-animations` pada 29 Julai 2026, terhadap commit `dec5d14`.
Bar kualiti diambil dari falsafah kejuruteraan reka bentuk Emil Kowalski.

## Pelan

| # | Tajuk | Teruk | Kategori | Status |
|---|---|---|---|---|
| [001](001-easing-tokens.md) | Konsolidasi lengkung easing jadi token | LOW* | Kohesi & token | DONE |
| [002](002-hover-gating.md) | Gate motion hover di belakang `@media (hover: hover)` | MEDIUM | Kebolehcapaian | DONE |
| [003](003-reduced-motion-scroll.md) | Matikan tatal-licin bawah reduced-motion | MEDIUM | Kebolehcapaian | DONE |
| [004](004-progress-bars-transform.md) | Buang `transition: all`; bar guna `scaleX` | **HIGH** | Prestasi | DONE |
| [005](005-tilt-raf-throttle.md) | Buang lag 350ms tilt + throttle rAF | **HIGH** | Prestasi + gangguan | DONE |
| [006](006-letterspacing-hover.md) | Berhenti animasi `letter-spacing` | MEDIUM | Prestasi | DONE |
| [007](007-detail-panel-origin.md) | Panel masuk dari arah ia melekat | MEDIUM | Fizikal & asal | DONE |
| [008](008-dead-reveal-css.md) | Buang CSS `.reveal` yang mati | LOW | Kohesi | DONE |
| [009](009-faq-accordion-reveal.md) | Jawapan FAQ meluncur, bukan meletup | LOW | Peluang terlepas | DONE |

\* 001 disenarai LOW mengikut kesan sendiri, tetapi ia **prasyarat** — empat pelan lain merujuk token yang ia cipta.

## Susunan pelaksanaan

```
001  ← WAJIB DAHULU (cipta --ease-out, --ease-in-out)
 ├── 002 → 006   (006 menyunting rule yang 002 pindahkan; jalan ikut turutan)
 ├── 004
 ├── 005
 ├── 007
 └── 009
003, 008 ← bebas, boleh bila-bila masa
```

**Kebergantungan sebenar:**
- **001 sebelum 002, 004, 005, 007, 009** — semuanya rujuk `var(--ease-out)`.
- **002 sebelum 006** — 002 memindahkan `.journey-item:hover .journey-year` ke dalam blok `@media (hover: hover)`; 006 kemudian menyuntingnya di lokasi barunya. Terbalik susunan = 006 menyunting baris yang 002 akan pindah, dan suntingan hilang.
- 003 dan 008 tidak menyentuh apa-apa yang lain sentuh.

## Sengaja TIDAK dirancang

Satu peluang dari audit **tidak** dijadikan pelan, supaya ia tidak hilang senyap:

- **Tukar bahasa membina semula halaman** (`src/pages/Landing.jsx:326`, `key={lang}`). Semua kandungan hilang-muncul serta-merta bila bahasa ditukar. Membetulkannya bermakna mengubah cara SplitText dibina semula — itu perubahan seni bina, bukan pelarasan motion, dan berisiko memecahkan koreografi hero. Perlu keputusan berasingan sebelum disentuh.

## Status pengesahan (29 Julai 2026)

Kesemua 9 pelan **dilaksanakan**. `npm run build` lulus (107 modul, 599ms).

**Disahkan secara mekanikal** — setiap kriteria "Done when" diperiksa terhadap kod dan terhadap CSS yang dikompil dalam `dist/`:

| Semakan | Hasil |
|---|---|
| `cubic-bezier(.22,1,.36,1)` taip-tangan tinggal | 0 |
| Lengkung melantun pada hover butang | 0 |
| `transition-all` dalam `src/` | 0 |
| Animasi `letter-spacing` | 0 |
| `@keyframes slideup` + rule `.reveal-in` | dibuang (tinggal sebutan dlm komen) |
| `@media (hover: hover)` gate | ada, 9 rule di dalamnya |
| `scroll-behavior: auto` bawah reduced-motion | ada |
| `--ease-out` dalam bundle terkompil | `cubic-bezier(.23, 1, .32, 1)` |
| Kelas Tailwind arbitrary terkompil | `transition-timing-function:var(--ease-out)`, `grid-template-rows:0fr/1fr`, `transform-origin:0/bottom` |

**BELUM disahkan — perlu mata manusia pada pelayar sebenar.** Semakan-rasa dalam setiap pelan tidak boleh dijawab dari kod:

- **005** — sama ada tilt kini melekat pada kursor (ini penemuan berasaskan rasa; kod betul ≠ rasa betul).
- **002** — kesan hover melekat pada peranti sentuh sebenar.
- **007** — arah masuk panel pada kedua-dua breakpoint + klik nod bertalu-talu.
- **009** — buka/tutup FAQ pantas berturut-turut.

## Nota

Pelan ditulis supaya boleh dilaksana oleh mana-mana ejen tanpa konteks perbualan asal: setiap satu ada laluan fail tepat, kod semasa verbatim, nilai sasaran tepat (cubic-bezier, tempoh), sempadan skop, dan langkah semakan-rasa.
