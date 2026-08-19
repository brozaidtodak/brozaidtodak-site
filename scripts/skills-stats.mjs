// ============================================================
// skills-stats.mjs — dijalankan SEBELUM vite build.
//
// MASALAH YANG DIA SELESAIKAN
// Bilangan skill ditaip tangan di lima tempat berlainan dan kelimanya
// dah lari antara satu sama lain: landing kata 259, header /skills kata
// 260, satu seksyen kata 242, footer kata 185, dan ada dua tarikh
// "kemaskini" yang berbeza pada halaman yang sama.
//
// PENYELESAIAN
// public/skills.html ialah SATU-SATUNYA sumber. Skrip ni kira terus dari
// kandungannya, tulis src/lib/skillsStats.json untuk dibaca landing, dan
// PECAHKAN BUILD kalau nombor yang tertulis dalam halaman itu sendiri
// tak sepadan dengan apa yang betul-betul ada di dalamnya.
//
// Jadi lain kali skill ditambah: kemas kini skills.html sahaja. Landing
// ikut sendiri, dan kalau ada nombor tertinggal, build menjerit.
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAGE = join(ROOT, 'public/skills.html')
const OUT = join(ROOT, 'src/lib/skillsStats.json')

const html = readFileSync(PAGE, 'utf8')

// ---- kira dari kandungan sebenar ----

// Satu kad .sk = satu catatan skill atau MCP.
const count = (html.match(/class="sk"/g) || []).length

// Seksyen "Skill Ikut Induk" senaraikan chip folder. Chip BERULANG antara
// kumpulan (kumpulan "tambahan sejak ..." mengulang skill yang dah tersenarai
// bawah induknya), jadi yang bermakna ialah bilangan UNIK.
const bahagianInduk = html.slice(html.indexOf('Skill Ikut Induk'))
const chip = [...bahagianInduk.matchAll(/class="fld"[^>]*>([^<]+)</g)].map((m) => m[1].trim())
const folders = new Set(chip).size

// Tarikh kemaskini diambil dari baris header, bukan ditaip dua kali.
const tarikh = html.match(/KEMASKINI\s+([^·<]+?)\s*·/)
const updated = tarikh ? tarikh[1].trim() : ''

const stats = { count, folders, updated }

// ---- pagar: nombor yang tertulis dalam halaman mesti sepadan ----
const salah = []

const kepalaAngka = html.match(/(\d+)\s+SKILL\s*&amp;\s*MCP/)
if (!kepalaAngka) salah.push('baris header "N SKILL & MCP" tak dijumpai')
else if (Number(kepalaAngka[1]) !== count) salah.push(`header kata ${kepalaAngka[1]} SKILL & MCP, sebenarnya ${count}`)

const indukAngka = html.match(/Skill Ikut Induk[^(]*\((\d+)\)/)
if (!indukAngka) salah.push('tajuk "Skill Ikut Induk (N)" tak dijumpai')
else if (Number(indukAngka[1]) !== folders) salah.push(`tajuk Skill Ikut Induk kata ${indukAngka[1]}, folder unik sebenarnya ${folders}`)

const footerAngka = html.match(/(\d+)\s+folder skill/)
if (!footerAngka) salah.push('baris footer "N folder skill" tak dijumpai')
else if (Number(footerAngka[1]) !== folders) salah.push(`footer kata ${footerAngka[1]} folder, sebenarnya ${folders}`)

// Setiap tarikh "kemaskini" dalam halaman mesti merujuk hari yang sama.
// Dibandingkan tanpa mengira huruf besar dan singkatan bulan (OGO / Ogos),
// sebab header guna huruf besar dan footer guna huruf biasa.
const semuaTarikh = [...html.matchAll(/kemaskini\s+(\d{1,2}\s+[A-Za-z]+\s+\d{4})/gi)].map((m) => m[1])
const norm = (t) => t.toLowerCase().replace(/\bogo\b/, 'ogos').replace(/\s+/g, ' ')
const tarikhUnik = [...new Set(semuaTarikh.map(norm))]
if (tarikhUnik.length > 1) salah.push(`ada ${tarikhUnik.length} tarikh kemaskini berbeza: ${semuaTarikh.join(' / ')}`)

// Tajuk, meta description dan OG semuanya sebut bilangan yang sama.
for (const m of html.matchAll(/(\d{3})\s+[Ss]kill/g)) {
  if (Number(m[1]) !== count) salah.push(`teks "${m[1]} skill" tak sepadan dengan ${count} kad sebenar`)
}

if (salah.length) {
  console.error('\nskills-stats: NOMBOR DALAM public/skills.html DAH LARI\n')
  for (const x of salah) console.error('  - ' + x)
  console.error(`\n  Sebenarnya: ${count} kad · ${folders} folder unik · kemaskini ${updated}`)
  console.error('  Betulkan public/skills.html, kemudian build semula.\n')
  process.exit(1)
}

writeFileSync(OUT, JSON.stringify(stats, null, 2) + '\n')
console.log(`skills-stats: ${count} skill · ${folders} folder unik · kemaskini ${updated}`)
