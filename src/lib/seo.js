// ============================================================
// SEO — satu sumber untuk meta setiap route.
//
// Fail ni SENGAJA tulen JavaScript, tiada import React, sebab dua
// tempat guna dia:
//   1. useHead.js  (dalam pelayar — tajuk tab, tukar bahasa, navigasi SPA)
//   2. scripts/prerender.mjs (masa build — jana HTML statik per route)
//
// Kenapa perlu prerender: scraper WhatsApp / Facebook / LinkedIn / X
// TIDAK jalankan JavaScript. Meta yang disuntik React tak akan nampak
// oleh mereka langsung. Jadi tag yang sama kena wujud dalam HTML mentah
// yang dihantar server. Kedua-duanya baca fail ni supaya tak boleh lari.
// ============================================================

export const SITE = 'https://brozaidtodak.com'
export const SITE_NAME = 'brozaidtodak'
export const OG_DEFAULT = `${SITE}/og.png`
export const OG_SERVIS = `${SITE}/og-servis.png`

// Pautan sosial rasmi — dipakai JSON-LD sameAs.
export const SAMEAS = [
  'https://instagram.com/brozaidtodak',
  'https://tiktok.com/@brozaidtodak',
  'https://10camp.com',
  'https://github.com/brozaidtodak',
]

// ------------------------------------------------------------
// Meta per route.
//   langs : bahasa yang halaman ni betul-betul ada. Satu bahasa
//           sahaja bermakna tiada hreflang alternate, dan <html lang>
//           dikunci pada bahasa itu walaupun toggle ditekan.
//   noindex: halaman peribadi / bergate. Tak masuk sitemap.
// ------------------------------------------------------------
const PAKEJ = {
  kilat: {
    ms: { t: 'Pakej KILAT — satu sistem siap dalam 7 hari',
          d: 'Satu masalah, satu sistem, siap seminggu. Sesuai untuk peniaga yang nak buang satu kerja manual dengan cepat sebelum komit projek besar.' },
    en: { t: 'KILAT package — one system shipped in 7 days',
          d: 'One problem, one system, delivered in a week. For owners who want a single manual task gone quickly before committing to a bigger build.' },
  },
  asas: {
    ms: { t: 'Pakej ASAS — sistem operasi kedai, 3 hingga 4 minggu',
          d: 'Stok, jualan dan kos dalam satu tempat. Untuk kedai yang dah jalan tapi masih bergantung pada Excel dan WhatsApp.' },
    en: { t: 'ASAS package — shop operating system, 3 to 4 weeks',
          d: 'Stock, sales and costs in one place. For shops already running but still leaning on Excel and WhatsApp.' },
  },
  operasi: {
    ms: { t: 'Pakej OPERASI — pindah operasi penuh, 2 hingga 3 bulan',
          d: 'Operasi penuh dipindahkan ke sistem sendiri: POS, stok, kewangan, sambungan marketplace. Untuk bisnes yang dah terlalu besar untuk kerja manual.' },
    en: { t: 'OPERASI package — full operations migration, 2 to 3 months',
          d: 'Your whole operation moved onto systems you own: POS, stock, finance, marketplace links. For businesses that have outgrown manual work.' },
  },
}

export const ROUTES = {
  '/': {
    langs: ['ms', 'en'],
    ms: {
      title: 'Bro Zaid Todak — Retailer · Builder · Naturalist',
      desc: 'Bro Zaid Todak, pengasas 10 CAMP, peruncitan peralatan outdoor di Malaysia. Membangunkan keseluruhan sistem perniagaan secara dalaman: POS, kewangan, HR.',
    },
    en: {
      title: 'Bro Zaid Todak — Retailer · Builder · Naturalist',
      desc: 'Bro Zaid Todak, founder of 10 CAMP, an outdoor gear retailer in Malaysia. The entire business system built in-house: POS, finance, HR.',
    },
    jsonld: ['person'],
  },

  '/servis': {
    langs: ['ms', 'en'],
    ms: {
      title: 'Servis bina sistem bisnes — brozaidtodak',
      desc: 'Stok dalam Excel, order dalam WhatsApp, laporan dalam kepala. Saya bina sistem yang buang kerja tu. Tiga pakej, harga terbuka, kod jadi milik awak.',
    },
    en: {
      title: 'Business systems, built for you — brozaidtodak',
      desc: 'Stock in Excel, orders in WhatsApp, reports in your head. I build the systems that remove that work. Three packages, open pricing, you own the code.',
    },
    og: OG_SERVIS,
    jsonld: ['service', 'faq'],
  },

  '/journey': {
    langs: ['ms'],
    ms: {
      title: 'Pokok kerjaya — Bro Zaid Todak',
      desc: 'Peta perjalanan dari sekolah ke peruncitan vape, ke 10 CAMP, ke membina sistem sendiri. Pokok interaktif: klik mana-mana nod untuk baca ceritanya.',
    },
  },

  '/roadmap': {
    langs: ['ms'],
    noindex: true,
    ms: {
      title: 'Roadmap laman — brozaidtodak',
      desc: 'Peta pembangunan brozaidtodak.com.',
    },
  },

  '/login': {
    langs: ['ms'],
    noindex: true,
    ms: {
      title: 'Command Centre — brozaidtodak',
      desc: 'Log masuk Command Centre.',
    },
  },
}

// Halaman pakej dijana dari PAKEJ supaya tambah pakej baru = satu tempat.
for (const slug of Object.keys(PAKEJ)) {
  ROUTES[`/servis/${slug}`] = {
    langs: ['ms', 'en'],
    ms: { title: `${PAKEJ[slug].ms.t} — brozaidtodak`, desc: PAKEJ[slug].ms.d },
    en: { title: `${PAKEJ[slug].en.t} — brozaidtodak`, desc: PAKEJ[slug].en.d },
    og: OG_SERVIS,
  }
}

// ------------------------------------------------------------
// Bahasa berkesan: kalau halaman BM sahaja, toggle EN tak boleh
// buat <html lang> menipu. Ini punca aduan lang="en" atas halaman
// yang 100% Bahasa Melayu.
// ------------------------------------------------------------
export function langFor(path, wanted) {
  const r = ROUTES[path]
  if (!r) return 'ms'
  return r.langs.includes(wanted) ? wanted : r.langs[0]
}

export function metaFor(path, wanted) {
  const r = ROUTES[path]
  if (!r) return null
  const lang = langFor(path, wanted)
  const copy = r[lang] || r[r.langs[0]]
  return {
    path,
    lang,
    langs: r.langs,
    noindex: !!r.noindex,
    title: copy.title,
    desc: copy.desc,
    og: r.og || OG_DEFAULT,
    url: path === '/' ? `${SITE}/` : `${SITE}${path}`,
    jsonld: r.jsonld || [],
  }
}

// ------------------------------------------------------------
// JSON-LD. Dipulangkan sebagai objek supaya prerender boleh
// stringify dan hook boleh masukkan ke dalam <script>.
// ------------------------------------------------------------
export function jsonLdPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Zaid Ariffuddin bin Zainal Ariffin',
    alternateName: 'Bro Zaid Todak',
    url: `${SITE}/`,
    jobTitle: 'Founder, retailer and systems builder',
    worksFor: {
      '@type': 'Organization',
      name: '10 CAMP',
      url: 'https://10camp.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cyberjaya',
      addressRegion: 'Selangor',
      addressCountry: 'MY',
    },
    sameAs: SAMEAS,
  }
}

export function jsonLdService(pakej) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'brozaidtodak — bina sistem bisnes',
    url: `${SITE}/servis`,
    image: OG_SERVIS,
    provider: {
      '@type': 'Person',
      name: 'Bro Zaid Todak',
      url: `${SITE}/`,
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cyberjaya',
      addressRegion: 'Selangor',
      addressCountry: 'MY',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pakej bina sistem',
      itemListElement: pakej.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        description: p.desc,
        url: `${SITE}/servis/${p.slug}`,
        priceCurrency: 'USD',
        price: String(p.price),
        ...(p.from ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: String(p.price), priceCurrency: 'USD' } } : {}),
      })),
    },
  }
}

export function jsonLdFaq(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

// Route yang masuk sitemap: awam sahaja.
export const INDEXABLE = Object.keys(ROUTES).filter((p) => !ROUTES[p].noindex)
