// ============================================================
// i18n — kamus bahasa untuk Landing page (public sahaja)
// Dashboard/Command Centre kekal BM (private, owner-only).
//
// Cara tambah bahasa baru (cth Mandarin / Tamil):
//   1. Salin blok `en` di bawah, tukar key jadi `zh` / `ta`
//   2. Terjemah setiap nilai (struktur mesti SAMA — key jangan ubah)
//   3. Isi projects[] & journey[] & stats[] ikut susunan yang sama
//   4. Siap — butang bahasa muncul automatik (lihat availableLangs)
//
// Bahasa yang BELUM ada dalam COPY tak akan tunjuk butang lagi.
// Fallback: kalau satu key hilang, jatuh balik ke English.
// ============================================================

export const LANGS = [
  { code: 'ms', short: 'BM',     label: 'Melayu'  },
  { code: 'en', short: 'EN',     label: 'English' },
  { code: 'zh', short: '中文',    label: '中文'     },
  { code: 'ta', short: 'தமிழ்',  label: 'தமிழ்'   },
]

export const DEFAULT_LANG = 'ms'

// Kelas warna untuk role pills — ikut kedudukan (bukan teks), jadi
// dikongsi semua bahasa.
export const ROLE_TONES = ['text-accent', 'text-white', 'text-white/70']

const ms = {
  nav: {
    commandCentre: 'Command Centre',
    enterCommandCentre: 'Enter Command Centre',
  },
  hero: {
    location: 'Cyberjaya, Malaysia',
    titleL1: 'Membina',
    titleL2: 'perniagaan.',
    titleAccent: 'Membina sistemnya sekali.',
    subPre: 'Pengasas ',
    subBrand: '10 CAMP',
    subPost:
      ' — peruncitan peralatan outdoor di Malaysia. Keseluruhan sistem operasinya — POS, kewangan, HR — dibangunkan secara dalaman, dari asas.',
    roles: ['Retailer · 10 CAMP', 'Builder', 'Naturalist'],
    ctaPortfolio: 'Lihat portfolio',
    ctaContact: 'Hubungi saya',
    scroll: 'Skrol',
    scrollAria: 'Skrol ke bawah',
  },
  statement: {
    pre: 'Daripada peruncitan vape kepada peralatan kembara — satu prinsip kekal: ',
    accent: 'jika sistemnya tiada, bina sendiri.',
  },
  focus: {
    label: 'Fokus semasa',
    heading: 'Peruncit di siang hari, pembina sistem di malam hari.',
    p1: '10 CAMP beroperasi di Shopee, TikTok Shop dan kedai fizikal. Apabila perniagaan berkembang, sistem sedia ada tidak lagi mencukupi — maka setiap satunya dibangunkan secara dalaman: POS untuk operasi kedai, back office untuk kewangan, portal HR untuk pengurusan tenaga kerja.',
    p2: 'Bukan pengaturcara terlatih — peruncit yang membina sistem kerana perniagaan sendiri yang memerlukannya. Setiap modul lahir daripada masalah operasi yang sebenar.',
    stats: [
      { count: 5, suffix: '', label: 'Tahun dalam industri peruncitan' },
      { count: 10, suffix: '+', label: 'Sistem & platform dibangunkan' },
      { count: 1, suffix: '', label: 'Jenama · 10 CAMP' },
    ],
  },
  portfolio: {
    label: 'Portfolio',
    heading: 'Satu perniagaan, satu ekosistem.',
    visit: 'Lawati laman →',
    projects: [
      { tag: 'Perniagaan utama', desc: 'Peruncitan peralatan outdoor dan camping di Malaysia — beroperasi di Shopee, TikTok Shop dan kedai fizikal dengan inventori bersepadu dalam satu sistem.' },
      { tag: 'Sistem runcit', desc: 'Sistem point-of-sale lengkap yang dibangunkan dari asas — jualan, inventori, pengurusan staf, program kesetiaan pelanggan dan pembantu AI.' },
      { tag: 'Kewangan', desc: 'Back office kewangan bersepadu — lejar am, penyelarasan settlement marketplace, payroll dan pelaporan untung rugi.' },
      { tag: 'Sumber manusia', desc: 'Portal HR untuk pengurusan tenaga kerja — penjadualan syif, rekod kakitangan dan laporan operasi harian secara automatik.' },
      { tag: 'Perniagaan keluarga', desc: 'Pembangunan identiti jenama dan laman web rasmi untuk jenama bunga manik buatan tangan.' },
      { tag: 'Perniagaan keluarga', desc: 'Sistem POS dan back office untuk perniagaan batik keluarga — dibangunkan dengan standard yang sama seperti operasi utama.' },
    ],
  },
  journey: {
    label: 'Perjalanan',
    items: [
      { year: '2021 – 2023', title: 'Peruncitan vape', desc: 'Permulaan dalam dunia peruncitan — pengurusan jualan, inventori dan aliran tunai. Perniagaan telah ditutup; pengalamannya kekal menjadi asas.' },
      { year: 'Berterusan', title: 'Pembaikan telefon', desc: 'Kemahiran teknikal yang dikekalkan sehingga kini — diagnosis, pembaikan dan pemasangan semula. Disiplin yang sama diterapkan dalam pembinaan sistem.' },
      { year: '2024', title: '10 CAMP diasaskan', desc: 'Peralihan kepada peralatan outdoor — bermula dengan platform sedia ada seperti Shopify dan EasyStore.' },
      { year: '2025', title: 'Pembangunan dalaman bermula', desc: 'Sistem sedia ada tidak lagi menampung keperluan operasi. Sistem POS pertama dibangunkan sendiri — diikuti modul demi modul.' },
      { year: '2026', title: 'Ekosistem lengkap', desc: 'POS, kewangan, HR, mesyuarat dan perancangan — keseluruhannya dibangunkan secara dalaman dan saling bersepadu.' },
    ],
  },
  contact: {
    heading: 'Mari berhubung.',
    body: 'Untuk kerjasama, pertanyaan perniagaan atau perbincangan mengenai pembangunan sistem — hubungi saya melalui e-mel atau media sosial.',
    copyTitle: 'Klik untuk salin',
    copied: 'Disalin!',
    footer: '© 2026 Bro Zaid Todak',
  },
}

const en = {
  nav: {
    commandCentre: 'Command Centre',
    enterCommandCentre: 'Enter Command Centre',
  },
  hero: {
    location: 'Cyberjaya, Malaysia',
    titleL1: 'Building',
    titleL2: 'the business.',
    titleAccent: 'And the system behind it.',
    subPre: 'Founder of ',
    subBrand: '10 CAMP',
    subPost:
      ' — outdoor and camping gear retail in Malaysia. Its entire operating stack — POS, finance, HR — built in-house, from the ground up.',
    roles: ['Retailer · 10 CAMP', 'Builder', 'Naturalist'],
    ctaPortfolio: 'View portfolio',
    ctaContact: 'Get in touch',
    scroll: 'Scroll',
    scrollAria: 'Scroll down',
  },
  statement: {
    pre: 'From vape retail to outdoor gear — one principle holds: ',
    accent: "if the system doesn't exist, build it.",
  },
  focus: {
    label: 'Current focus',
    heading: 'Retailer by day, systems builder by night.',
    p1: '10 CAMP operates across Shopee, TikTok Shop and a physical store. As the business grew, off-the-shelf systems stopped keeping up — so each one was built in-house: a POS for store operations, a back office for finance, an HR portal for the workforce.',
    p2: 'Not a trained programmer — a retailer who builds systems because the business needs them. Every module was born from a real operational problem.',
    stats: [
      { count: 5, suffix: '', label: 'Years in retail' },
      { count: 10, suffix: '+', label: 'Systems & platforms built' },
      { count: 1, suffix: '', label: 'Brand · 10 CAMP' },
    ],
  },
  portfolio: {
    label: 'Portfolio',
    heading: 'One business, one ecosystem.',
    visit: 'Visit site →',
    projects: [
      { tag: 'Core business', desc: 'Outdoor and camping gear retail in Malaysia — operating across Shopee, TikTok Shop and a physical store, with unified inventory in one system.' },
      { tag: 'Retail system', desc: 'A full point-of-sale system built from scratch — sales, inventory, staff management, customer loyalty and an AI assistant.' },
      { tag: 'Finance', desc: 'An integrated finance back office — general ledger, marketplace settlement reconciliation, payroll and profit-and-loss reporting.' },
      { tag: 'Human resources', desc: 'An HR portal for workforce management — shift scheduling, staff records and automated daily operations reporting.' },
      { tag: 'Family business', desc: 'Brand identity and official website development for a handmade beaded-flower brand.' },
      { tag: 'Family business', desc: 'A POS and back office for a family batik business — built to the same standard as the main operation.' },
    ],
  },
  journey: {
    label: 'Journey',
    items: [
      { year: '2021 – 2023', title: 'Vape retail', desc: 'Started out in retail — managing sales, inventory and cash flow. The business has since closed; the experience remains the foundation.' },
      { year: 'Ongoing', title: 'Phone repair', desc: 'Technical skills kept alive to this day — diagnosis, repair and reassembly. The same discipline carries into building systems.' },
      { year: '2024', title: '10 CAMP founded', desc: 'A shift to outdoor gear — starting on existing platforms like Shopify and EasyStore.' },
      { year: '2025', title: 'In-house development begins', desc: 'Off-the-shelf systems could no longer keep up with operations. The first POS was built in-house — followed module by module.' },
      { year: '2026', title: 'A complete ecosystem', desc: 'POS, finance, HR, meetings and planning — all built in-house and fully integrated.' },
    ],
  },
  contact: {
    heading: "Let's connect.",
    body: 'For collaborations, business enquiries or a conversation about building systems — reach me by email or social media.',
    copyTitle: 'Click to copy',
    copied: 'Copied!',
    footer: '© 2026 Bro Zaid Todak',
  },
}

// Mandarin & Tamil: struktur sedia, teks tunggu Zaid.
// Bila siap, tukar `null` → objek (salin bentuk `en`) dan butang
// bahasa muncul automatik.
const zh = null
const ta = null

export const COPY = { ms, en, zh, ta }

// Fallback English kalau satu-satu key hilang bila zh/ta diisi separa.
export function copyFor(code) {
  return COPY[code] || COPY[DEFAULT_LANG]
}

// Bahasa yang betul-betul ada teks → hanya ini tunjuk butang.
export const availableLangs = LANGS.filter((l) => COPY[l.code])
