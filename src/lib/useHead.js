import { useEffect } from 'react'
import { metaFor, SITE, SITE_NAME } from './seo.js'

// ============================================================
// useHead — pengurus <head> tanpa dependency baru.
//
// Kenapa bukan react-helmet: kita cuma perlu ~12 tag pada 8 route.
// Helmet menambah saiz bundle untuk masalah yang tiga puluh baris
// ni dah selesaikan, dan ia TETAP tak menolong scraper WhatsApp
// (mereka tak jalankan JS). Kerja sebenar untuk scraper dibuat oleh
// scripts/prerender.mjs masa build. Hook ni untuk pelayar sahaja:
// tajuk tab, navigasi dalam SPA, dan tukar bahasa.
//
// Tag yang dah wujud (dari HTML prerender) DIKEMASKINI, bukan
// diduplikasi — sebab itu upsert cari dulu sebelum cipta.
// ============================================================

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute('data-seo', '1')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extra) {
  const sel = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra?.hreflang) el.setAttribute('hreflang', extra.hreflang)
    el.setAttribute('data-seo', '1')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(blocks) {
  document.head.querySelectorAll('script[data-seo-ld]').forEach((n) => n.remove())
  blocks.forEach((obj, i) => {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.setAttribute('data-seo-ld', String(i))
    s.textContent = JSON.stringify(obj)
    document.head.appendChild(s)
  })
}

/**
 * @param {string} path  laluan route, cth '/servis' atau '/servis/kilat'
 * @param {string} lang  bahasa yang pengguna pilih ('ms' | 'en')
 * @param {object[]} jsonld  blok JSON-LD sedia dibina (pilihan)
 */
export function useHead(path, lang, jsonld = []) {
  // Dep dikira dari kandungan, bukan rujukan array. Pemanggil biasanya
  // bina array JSON-LD baru setiap render; kalau array itu jadi dep,
  // effect ni jalan semula setiap render tanpa sebab.
  const ldKey = jsonld.length ? JSON.stringify(jsonld) : ''

  useEffect(() => {
    const m = metaFor(path, lang)
    if (!m) return

    // <html lang> ikut bahasa BERKESAN, bukan bahasa yang ditekan.
    // Halaman BM sahaja kekal lang="ms" walaupun toggle EN ditekan,
    // supaya atribut tu tak menipu pembaca skrin dan enjin carian.
    document.documentElement.lang = m.lang
    document.title = m.title

    upsertMeta('name', 'description', m.desc)
    upsertMeta('property', 'og:type', path === '/' ? 'profile' : 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', m.title)
    upsertMeta('property', 'og:description', m.desc)
    upsertMeta('property', 'og:url', m.url)
    upsertMeta('property', 'og:image', m.og)
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:locale', m.lang === 'en' ? 'en_MY' : 'ms_MY')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', m.title)
    upsertMeta('name', 'twitter:description', m.desc)
    upsertMeta('name', 'twitter:image', m.og)
    upsertMeta('name', 'robots', m.noindex ? 'noindex, nofollow' : 'index, follow')

    upsertLink('canonical', m.url)

    // Sengaja TIADA hreflang: BM dan EN kongsi URL yang sama, jadi
    // pasangan hreflang akan menunjuk ke alamat serupa dan itu anotasi
    // tak sah. og:locale:alternate yang betul untuk keadaan ni.
    document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((n) => n.remove())
    if (m.langs.length > 1) {
      m.langs.filter((l) => l !== m.lang).forEach((l) => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:locale:alternate')
        el.setAttribute('content', l === 'en' ? 'en_MY' : 'ms_MY')
        el.setAttribute('data-seo', '1')
        document.head.appendChild(el)
      })
    }

    if (ldKey) setJsonLd(JSON.parse(ldKey))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, lang, ldKey])
}

export { SITE }
