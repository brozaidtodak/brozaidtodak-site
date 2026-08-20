// ============================================================
// POKOK KERJAYA (skill tree) — perjalanan Zaid dari sifar → builder.
// Tree tulen: setiap node ada SATU parent (root parent = null).
// Nak tambah pencapaian: tambah satu objek di NODES, set `parent`
// ke id node atasnya. Layout auto (lib/journeyTree layout()).
//
// cat: 'edu' | 'past' | 'business' | 'skill' | 'system'
// year: kosong '' kalau belum pasti (UI sorok kalau kosong)
// url: pautan luar (optional) · status: teks pill (optional)
// ============================================================

export const CATEGORIES = {
  edu:      { label: 'Pendidikan', color: '#2F5C8F' },  // steel blue
  past:     { label: 'Venture awal', color: '#6E6A5E' }, // gray (lampau)
  business: { label: 'Bisnes',      color: '#C23800' },  // Todak orange (teras)
  skill:    { label: 'Kemahiran',   color: '#8C5800' },  // amber
  system:   { label: 'Sistem',      color: '#141414' },  // near-white (output)
}

export const NODES = [
  // ---- AKAR / pendidikan ----
  { id: 'root',  parent: null,   cat: 'edu', title: 'Mula dari sifar', year: '',
    blurb: 'Budak sekolah rendah — zero knowledge. Semua yang ada hari ni bermula dari titik ni.' },
  { id: 'upsr',  parent: 'root', cat: 'edu', title: 'UPSR — 5A', year: '',
    blurb: 'Pencapaian akademik pertama. Bukti yang bila fokus & bersungguh, boleh berjaya.' },
  { id: 'spm',   parent: 'upsr', cat: 'edu', title: 'Sekolah Menengah · SPM', year: '',
    blurb: 'Habis persekolahan menengah. (Butiran/tahun boleh kau isi kemudian.)' },

  // ---- PIVOT ke bisnes ----
  { id: 'pivot', parent: 'spm', cat: 'past', title: 'Terjun peruncitan', year: '2021',
    blurb: 'Mula dunia bisnes sebenar — belajar jualan, urus stok, jaga aliran tunai. Sekolah kehidupan.' },

  // ---- CABANG: venture awal ----
  { id: 'vape',   parent: 'pivot', cat: 'past',  title: 'Peruncitan Vape', year: '2021–2023', status: 'Tutup',
    blurb: 'Bisnes pertama. Dah ditutup — tapi asas jualan, inventori & operasi yang dipelajari kekal jadi tapak.' },
  { id: 'repair', parent: 'pivot', cat: 'skill', title: 'Baiki Telefon', year: 'Berterusan',
    blurb: 'Kemahiran teknikal yang dikekalkan — diagnosis, baiki, pasang semula. Disiplin sama diterapkan bila bina sistem.' },

  // ---- 10 CAMP diasaskan (batang utama) ----
  { id: 'found', parent: 'pivot', cat: 'business', title: '10 CAMP diasaskan', year: '2024',
    blurb: 'Peralihan kepada peralatan outdoor. Bermula atas platform sedia ada (Shopify, EasyStore).' },

  // ---- CABANG 1: Bisnes ----
  { id: 'biz', parent: 'found', cat: 'business', title: 'Kembangkan bisnes', year: '2024 →',
    blurb: 'Bukan satu jenama je — beberapa perniagaan berjalan serentak, termasuk projek keluarga.' },
  { id: 'b_10camp',  parent: 'biz', cat: 'business', title: '10 CAMP', status: 'LIVE', url: 'https://10camp.com',
    blurb: 'Peruncitan peralatan outdoor & camping. Shopee, TikTok Shop dan kedai fizikal — inventori bersepadu.' },
  { id: 'b_shedan',  parent: 'biz', cat: 'business', title: 'Shedan Bunga', status: 'LIVE', url: 'https://shedanbunga.com',
    blurb: 'Jenama bunga manik buatan tangan (projek keluarga — Atiqah). Identiti jenama + laman web.' },
  { id: 'b_sabrina', parent: 'biz', cat: 'business', title: 'Empayar Sabrina', status: 'LIVE',
    blurb: 'Sistem POS + back office untuk perniagaan batik keluarga — standard sama macam operasi utama.' },
  { id: 'b_kpt',     parent: 'biz', cat: 'business', title: 'Kambing Pak Teh', status: 'Paused',
    blurb: 'Projek penternakan kambing — masih peringkat rancangan.' },

  // ---- CABANG 2: Belajar bina dengan AI ----
  { id: 'ai', parent: 'found', cat: 'skill', title: 'Belajar bina dengan AI', year: '2025 →',
    blurb: 'Lonjakan besar. Dari HANYA business owner → boleh bina sistem sendiri dari asas, guna AI sebagai enjin.' },
  { id: 's_fe', parent: 'ai', cat: 'skill', title: 'Frontend',
    blurb: 'React, Tailwind, GSAP, reka bentuk UI. Bina muka aplikasi yang orang guna.' },
  { id: 's_be', parent: 'ai', cat: 'skill', title: 'Backend',
    blurb: 'Supabase, pangkalan data, API, Netlify functions. Logik & data di belakang tabir.' },
  { id: 's_ai', parent: 'ai', cat: 'skill', title: 'AI Utilisation',
    blurb: 'Claude Code, ejen automasi, guardian, pembantu AI. Guna AI untuk bina & jaga sistem.' },

  // ---- DAUN: sistem yang dah dibina (output kemahiran) ----
  { id: 'sys', parent: 'ai', cat: 'system', title: 'Sistem dibina', year: '2025–2026',
    blurb: 'Hasil kemahiran — sistem sebenar yang menjalankan operasi harian bisnes.' },
  { id: 'y_pos',      parent: 'sys', cat: 'system', title: 'POS 10 CAMP', status: 'LIVE', url: 'https://pos.10camp.com',
    blurb: 'Point-of-sale lengkap dibina dari asas — jualan, inventori, staf, loyalty, pembantu AI.' },
  { id: 'y_10cc',     parent: 'sys', cat: 'system', title: '10cc Command Centre', status: 'LIVE',
    blurb: 'Back office kewangan owner — lejar am, settlement marketplace, payroll, untung per order.' },
  { id: 'y_hr10',     parent: 'sys', cat: 'system', title: 'hr10 HR Portal', status: 'LIVE',
    blurb: 'Portal HR — payroll, jadual syif, rekod staf, laporan operasi.' },
  { id: 'y_invest',   parent: 'sys', cat: 'system', title: 'invest10cc', status: 'LIVE',
    blurb: 'Dashboard pelabur — modal, ROID, graf pertumbuhan.' },
  { id: 'y_meeting',  parent: 'sys', cat: 'system', title: 'meeting + planning', status: 'LIVE',
    blurb: 'Portal mesyuarat & papan perancangan owner untuk susun operasi.' },
  { id: 'y_training', parent: 'sys', cat: 'system', title: 'training', status: 'LIVE',
    blurb: 'Laman latihan staf — belajar guna sistem & AI.' },
  { id: 'y_bzt',      parent: 'sys', cat: 'system', title: 'brozaidtodak.com', status: 'LIVE', url: 'https://brozaidtodak.com',
    blurb: 'Command centre peribadi ni sendiri — landing awam + dashboard privat.' },
]

// ---- Layout: tidy top-down tree (Reingold–Tilford ringkas) ----
// Pulangkan { nodes: [{...node, x, y, depth}], edges: [{from,to,x1,y1,x2,y2}], width, height }
export function layoutTree(nodes = NODES, opts = {}) {
  const xGap = opts.xGap ?? 172
  const yGap = opts.yGap ?? 132
  const byId = new Map(nodes.map((n) => [n.id, { ...n }]))
  const children = new Map()
  let root = null
  for (const n of byId.values()) {
    if (n.parent == null) root = n
    else {
      if (!children.has(n.parent)) children.set(n.parent, [])
      children.get(n.parent).push(n)
    }
  }
  // depth (BFS)
  const setDepth = (node, d) => {
    node.depth = d
    for (const c of children.get(node.id) || []) setDepth(c, d + 1)
  }
  if (root) setDepth(root, 0)

  // x: post-order — leaf dapat slot berturut; parent = purata anak
  let leafX = 0
  const assignX = (node) => {
    const kids = children.get(node.id) || []
    if (kids.length === 0) {
      node.x = leafX * xGap
      leafX += 1
    } else {
      kids.forEach(assignX)
      node.x = (kids[0].x + kids[kids.length - 1].x) / 2
    }
    node.y = node.depth * yGap
  }
  if (root) assignX(root)

  const laid = [...byId.values()]
  const xs = laid.map((n) => n.x)
  const ys = laid.map((n) => n.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  // normalize supaya mula dari padding
  const pad = 90
  laid.forEach((n) => { n.x = n.x - minX + pad; n.y = n.y - minY + pad })

  const edges = []
  for (const n of laid) {
    if (n.parent != null) {
      const p = byId.get(n.parent)
      edges.push({ from: p.id, to: n.id, x1: p.x, y1: p.y, x2: n.x, y2: n.y })
    }
  }
  return {
    nodes: laid,
    edges,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  }
}
