// ============================================================
// prerender.mjs — dijalankan selepas `vite build`.
//
// MASALAH YANG DIA SELESAIKAN
// Laman ni SPA. Semua URL dilayan oleh satu index.html yang sama, dan
// meta disuntik React selepas JavaScript jalan. Scraper WhatsApp,
// Facebook, LinkedIn dan X TIDAK jalankan JavaScript — mereka baca HTML
// mentah sekali, itu sahaja. Jadi meta yang disuntik React tak wujud
// langsung untuk mereka, dan link dikongsi keluar botak.
//
// PENYELESAIAN
// Salin index.html hasil build ke satu folder per route, dengan <head>
// yang betul dan JSON-LD dah tertulis di dalam. Netlify melayan fail
// statik sebelum SPA catch-all, jadi /servis dapat dist/servis/index.html
// manakala React tetap hydrate macam biasa selepas itu.
//
// Tiada dependency baru. Cuma fs + string.
// ============================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ROUTES, INDEXABLE, SITE, SITE_NAME,
  metaFor, jsonLdPerson, jsonLdService, jsonLdFaq,
} from '../src/lib/seo.js'
import { PRICES, copyFor } from '../src/lib/servis.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// JSON-LD dalam <script> tak boleh mengandungi "</script>" mentah.
const escLd = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

// ---- tarikh ubah terakhir, ikut git supaya lastmod tak bergerak
//      setiap kali deploy kalau kandungan tak berubah ----
function lastmodFor(file) {
  try {
    const out = execSync(`git log -1 --format=%cs -- ${file}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim()
    if (out) return out
  } catch { /* bukan repo git / fail baru */ }
  return new Date().toISOString().slice(0, 10)
}

const SOURCE_OF = {
  '/': 'src/pages/Landing.jsx',
  '/servis': 'src/pages/Servis.jsx',
  '/servis/kilat': 'src/lib/servisPages.js',
  '/servis/asas': 'src/lib/servisPages.js',
  '/servis/operasi': 'src/lib/servisPages.js',
  '/journey': 'src/lib/journeyTree.js',
}

// ---- JSON-LD per route, dibina dari data sebenar halaman ----
function ldFor(path) {
  const r = ROUTES[path]
  if (!r?.jsonld?.length) return []
  const out = []
  for (const kind of r.jsonld) {
    if (kind === 'person') out.push(jsonLdPerson())
    if (kind === 'service') {
      const c = copyFor('ms')
      out.push(jsonLdService(c.pkg.items.map((p) => ({
        slug: p.id,
        name: `${p.name} · ${p.tagline}`,
        desc: p.for,
        price: PRICES[p.id],
        from: !!p.from,
      }))))
    }
    if (kind === 'faq') out.push(jsonLdFaq(copyFor('ms').faq.items))
  }
  return out
}

// ---- bina blok <head> untuk satu route ----
function headFor(m) {
  const t = esc(m.title)
  const d = esc(m.desc)
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${m.url}" />`,
    `<meta property="og:type" content="${m.path === '/' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${m.url}" />`,
    `<meta property="og:image" content="${m.og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${m.lang === 'en' ? 'en_MY' : 'ms_MY'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${m.og}" />`,
  ]
  // TIADA hreflang di sini, dan itu SENGAJA.
  // hreflang perlukan satu URL BERBEZA per bahasa. Laman ni hidangkan BM
  // dan EN pada URL yang sama (toggle client-side), jadi dua tag hreflang
  // yang menunjuk ke alamat serupa = anotasi tak sah; Google abaikan
  // seluruh set. og:locale:alternate pula memang sah untuk kes ni.
  if (m.langs.length > 1) {
    for (const l of m.langs) {
      if (l === m.lang) continue
      tags.push(`<meta property="og:locale:alternate" content="${l === 'en' ? 'en_MY' : 'ms_MY'}" />`)
    }
  }
  // data-seo-ld WAJIB ada: useHead cari atribut ni untuk BUANG blok lama
  // sebelum tulis yang baru. Tanpa dia, blok prerender kekal dan React
  // tambah satu lagi di atasnya, jadi setiap halaman ada JSON-LD berganda.
  ldFor(m.path).forEach((ld, i) => {
    tags.push(`<script type="application/ld+json" data-seo-ld="${i}">${escLd(ld)}</script>`)
  })
  return tags.map((x) => '    ' + x).join('\n')
}

// ---- main ----
const tplPath = join(DIST, 'index.html')
if (!existsSync(tplPath)) {
  console.error('prerender: dist/index.html tiada. Jalankan vite build dulu.')
  process.exit(1)
}
const tpl = readFileSync(tplPath, 'utf8')

let written = 0
for (const path of Object.keys(ROUTES)) {
  // Bahasa untuk HTML mentah = bahasa pertama route (BM untuk semua
  // sekarang). Pelawat yang tekan EN dapat kemas kini dari useHead.
  const m = metaFor(path, 'ms')

  let html = tpl
    .replace(/<html lang="[^"]*"/, `<html lang="${m.lang}"`)
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('</head>', headFor(m) + '\n  </head>')

  const outDir = path === '/' ? DIST : join(DIST, path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  written++
  console.log(`  ${path.padEnd(16)} -> ${path === '/' ? 'index.html' : path.slice(1) + '/index.html'}  (lang=${m.lang}${m.noindex ? ', noindex' : ''})`)
}

// ---- sitemap dijana dari senarai route yang sama, jadi tak boleh lari ----
const urls = INDEXABLE.map((p) => {
  const m = metaFor(p, 'ms')
  return `  <url>
    <loc>${m.url}</loc>
    <lastmod>${lastmodFor(SOURCE_OF[p] || 'src')}</lastmod>
  </url>`
})

// /skills ialah fail statik public/skills.html dengan <head> sendiri,
// bukan route React — tapi ia halaman awam, jadi ia masuk sitemap.
urls.push(`  <url>
    <loc>${SITE}/skills</loc>
    <lastmod>${lastmodFor('public/skills.html')}</lastmod>
  </url>`)

writeFileSync(join(DIST, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`)

console.log(`prerender: ${written} halaman + sitemap.xml (${urls.length} URL)`)
