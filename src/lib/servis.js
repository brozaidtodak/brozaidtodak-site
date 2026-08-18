// ============================================================
// SERVIS — data pakej, harga & teks untuk halaman /servis.
// Diasingkan dari komponen supaya harga/ayat senang ditune tanpa sentuh layout.
//
// DWIBAHASA: COPY.ms + COPY.en. Halaman ikut bahasa yang sama disimpan oleh
// Landing (localStorage 'bzt-lang'). zh/ta jatuh balik ke BM buat masa ni.
//
// Harga dipapar USD (keputusan Zaid: nampak professional utk client luar),
// RM ditunjuk kecil di sebelah supaya tokey tempatan tak perlu kira sendiri.
// ============================================================

export const FX = 4.25 // RM per USD — kemas kini bila kadar bergerak jauh
export const rm = (usd) => 'RM' + Math.round(usd * FX).toLocaleString('en-US')

// Nombor WhatsApp bisnes (format antarabangsa tanpa +).
// 601162586771 = talian Sudirman (pembantu WhatsApp) — dia terima pertanyaan awal.
export const WHATSAPP = '601162586771'
export const EMAIL = 'zaid@todak.com'

export const SERVIS_LANGS = ['ms', 'en']
export const langFor = (l) => (SERVIS_LANGS.includes(l) ? l : 'ms')

// ---- harga (tak berubah ikut bahasa) ----
export const PRICES = {
  diagnosis: 20,
  kilat: 250,
  asas: 800,
  operasi: 3500,
  retainer: [30, 90, 250],
}

const ms = {
  nav: { home: 'Laman utama' },
  hero: {
    label: 'Servis',
    l1: 'Stok dalam Excel.',
    l2: 'Order dalam WhatsApp.',
    l3: 'Laporan dalam kepala.',
    sub: 'Bisnes awak jalan — tapi separuh masa awak habis pada kerja yang sepatutnya mesin buat. Saya bina sistem yang buang kerja tu.',
    cta1: 'Tengok pakej',
    cta2: 'Lihat contoh sebenar',
  },
  about: {
    h1: 'Saya bukan agency. Saya ',
    hAccent: 'tokey kedai',
    h2: ' yang bina sistem sendiri untuk kedai saya.',
    p1: 'POS, stok, kos, gaji, sambungan Shopee & TikTok — semuanya saya bina untuk 10 CAMP, dan ia jalan setiap hari. Saya tak teka masalah peniaga. Saya hidup dengannya: stok mati, margin nipis, staf silap pack, duit marketplace lambat masuk.',
    p2: 'Sebab itu kita boleh terus cakap pasal bisnes awak, bukan pasal teknologi.',
  },
  proof: {
    label: 'Bukti',
    heading: 'Sistem yang betul-betul digunakan',
    items: [
      {
        name: '10 CAMP',
        role: 'Kedai peralatan berkhemah — bisnes saya sendiri',
        body: 'POS, inventori, kos, gaji, laporan dan sambungan Shopee & TikTok. Dibina sendiri, digunakan setiap hari oleh staf saya. Kami tinggalkan platform subscription sepenuhnya.',
        stats: [
          { v: '600+', l: 'produk diurus' },
          { v: '7 hari', l: 'kedai buka' },
          { v: '2 marketplace', l: 'stok segerak' },
        ],
      },
      {
        name: 'Shedan Bunga',
        role: 'Butik bunga & manik',
        body: 'Website kedai yang tarik terus dari inventori POS — tukar stok sekali, website ikut sendiri. Tiada dua tempat nak kemas kini.',
        stats: [
          { v: 'LIVE', l: 'shedanbunga.com' },
          { v: '1 sumber', l: 'data stok' },
        ],
      },
    ],
  },
  steps: {
    label: 'Cara kerja',
    items: [
      { no: '01', title: 'Diagnosis', body: 'Panggilan 30 minit. Saya dengar cara kerja awak sekarang, lepas tu terus beritahu mana yang paling membazir masa — dan apa patut dibaiki dulu.' },
      { no: '02', title: 'Bina', body: 'Skop dikunci bertulis sebelum mula. Awak tahu apa akan dapat, bila siap, dan berapa. Tiada bil terkejut di hujung.' },
      { no: '03', title: 'Jaga', body: 'Selepas siap, awak boleh ambil pelan bulanan supaya ada orang jaga bila platform berubah atau ada bug. Pilihan, bukan wajib.' },
    ],
  },
  demo3d: {
    label: 'Demo 3D',
    heading: 'Rupa sebenar sistem yang awak beli',
    sub: 'Setiap sistem yang saya bina duduk atas 4 lapisan yang sama. Seret model ni untuk pusing, tekan mana-mana lapisan untuk tahu kerja dia.',
    hint: 'Seret untuk pusing · tekan lapisan',
    idle: 'Setiap lapisan boleh ditekan. Mula dari atas: itu yang pelanggan awak nampak dulu. Makin ke bawah, makin dekat dengan enjin bisnes awak.',
    incl: 'Termasuk dalam pakej',
    ctaPakej: 'Tengok pakej',
    fail: 'Peranti ni tak dapat papar 3D. Lapisan sistem diterangkan di sebelah.',
    note: 'Model contoh sahaja: bentuk sebenar sistem ikut bisnes awak.',
    layers: [
      { name: 'Muka depan', desc: 'Apa yang pelanggan nampak: katalog, harga, borang order. Mesra telefon dan laju, sebab pelanggan awak bukan duduk depan laptop.', pakej: ['KILAT', 'ASAS'] },
      { name: 'Sistem dalaman', desc: 'Tempat staf bekerja: order masuk, stok, status siap. Sistem yang ingat, bukan kepala awak.', pakej: ['ASAS', 'OPERASI'] },
      { name: 'AI & automasi', desc: 'Kerja berulang jadi automatik: laporan harian, peringatan stok rendah, balasan soalan lazim di WhatsApp.', pakej: ['OPERASI'] },
      { name: 'Data', desc: 'Satu pangkalan data untuk semua lapisan. Angka yang sama di kedai, di telefon, di laporan. Tiada dua versi kebenaran.', pakej: ['ASAS', 'OPERASI'] },
    ],
  },
  pkg: {
    label: 'Pakej',
    heading: 'Mula kecil. Naik bila awak dah nampak hasilnya.',
    startHere: 'Mula di sini',
    forWho: 'Untuk siapa',
    excludes: 'Tak termasuk',
    from: 'dari',
    detail: 'Butiran & demo',
    footnote: 'Harga dalam USD. Client Malaysia bayar dalam Ringgit ikut kadar pada tarikh invois. Deposit 50% sebelum mula. Hosting & domain atas nama awak sendiri — saya tak mark-up.',
    diagnosis: {
      title: 'Sesi Diagnosis',
      meta: '30 minit · Percuma kalau ambil mana-mana pakej',
      points: [
        'Panggilan 30 minit — saya tanya cara kerja bisnes awak sekarang',
        'Saya terus beritahu 3 benda yang paling banyak membazir masa awak',
        'Ringkasan 3 point dihantar dalam WhatsApp selepas panggilan',
        'Awak boleh ambil ringkasan itu dan buat sendiri — tiada ikatan',
      ],
    },
    items: [
      {
        id: 'kilat', no: '01', name: 'KILAT', best: true,
        tagline: 'Satu kerja manual → satu alat',
        duration: 'Siap 7 hari',
        for: 'Ada satu kerja manual yang menyakitkan setiap minggu',
        gets: [
          '1 alat siap guna, ada link sendiri — buka atas telefon atau laptop, tak perlu install',
          'Data lama awak saya masukkan — Excel, Google Sheet, senarai WhatsApp',
          'Gambar produk terus dalam alat kalau ada',
          'Output automatik — PDF, Excel/CSV, atau teks siap paste WhatsApp',
          'Latihan 30 minit + rakaman video, boleh tengok balik bila-bila',
          'Sokongan 30 hari — apa-apa rosak, saya baiki percuma',
        ],
        excludes: [
          'Login staf ramai + hak akses berbeza',
          'Sambung ke Shopee / TikTok / POS sedia ada',
          'Lebih daripada satu alat',
        ],
      },
      {
        id: 'asas', no: '02', name: 'ASAS',
        tagline: 'Website + satu sistem dalaman',
        duration: '3–4 minggu',
        for: 'Belum ada website, atau website lama dah mati',
        gets: [
          'Website 5–8 seksyen — laju, elok atas telefon, SEO asas, butang WhatsApp',
          'Satu sistem dalaman: tempahan, inventori ringkas, order atau PO',
          'Login admin untuk awak urus sendiri',
          'Latihan staf 2 jam + panduan video',
          'Sokongan 60 hari',
        ],
        excludes: ['Sambung marketplace (jadi tambahan berasingan)', 'Aplikasi telefon'],
      },
      {
        id: 'operasi', no: '03', name: 'OPERASI', from: true,
        tagline: 'Sistem bisnes penuh',
        duration: '2–3 bulan',
        for: 'Stok, staf dan duit dah kelam-kabut',
        gets: [
          'POS, inventori, order, kos dan laporan dalam satu sistem',
          'Banyak pengguna, hak akses ikut jawatan',
          'Sambung marketplace + kemas kini stok dua hala',
          'Pindah data lama masuk sistem baru',
          'Bil ikut fasa: 30% mula · 30% separuh jalan · 40% serah',
          'Sokongan 90 hari',
        ],
        excludes: [],
      },
    ],
  },
  example: {
    label: 'Contoh sebenar · Pakej KILAT',
    heading: 'Katalog supplier → Purchase Order',
    beforeLabel: 'Sebelum',
    before: 'Katalog dalam Google Sheet. 122 produk. Nak tengok gambar kena tekan link satu-satu. Purchase Order ditaip manual dalam WhatsApp — SKU tersalah, kuantiti tertinggal.',
    beforeBig: '~45 minit', beforeSmall: 'satu order',
    afterLabel: 'Selepas',
    after: 'Pilih barang macam beli-belah dalam talian, gambar terus nampak, tekan sekali jadi Purchase Order PDF siap hantar kepada pembekal.',
    afterBig: '5 minit', afterSmall: 'sifar salah taip',
    shots: [
      { t: 'Pilih barang', b: '122 produk, 531 gambar, carian dan tapisan kategori. Jumlah harga terkumpul sambil pilih.' },
      { t: 'PO siap', b: 'Tekan sekali jadi PDF bergambar — lengkap SKU, kuantiti, harga dan ruang tandatangan.' },
    ],
    note: 'Kerja sebenar yang siap dan digunakan setiap hari — bukan mock-up.',
  },
  retainer: {
    label: 'Selepas siap',
    heading: 'Pelan bulanan — pilihan, bukan wajib',
    intro: 'Selepas sistem siap, benda tetap berlaku — platform tukar cara kerja, hosting kena perbaharui, staf minta laporan baru. Pelan bulanan bermakna ada orang jaga, tanpa awak perlu tanya harga setiap kali.',
    perMonth: '/bulan',
    approx: 'sebulan',
    plans: [
      { name: 'Jaga', points: 'Hosting dipantau, backup, semak uptime, baiki bug kecil, 2 jam kerja' },
      { name: 'Tumbuh', points: '8 jam kerja sebulan, laporan bulanan, tambah ciri kecil, keutamaan bug' },
      { name: 'Rakan Operasi', points: '20 jam, WhatsApp terus dengan saya, panggilan strategi bulanan' },
    ],
    footnote: 'Minimum 6 bulan. Jam yang tak digunakan tidak dibawa ke bulan berikutnya.',
  },
  faq: {
    label: 'Soalan lazim',
    items: [
      { q: 'Kenapa harga dalam USD?', a: 'Saya terima client dari luar negara juga, jadi harga disenaraikan dalam USD. Untuk client Malaysia, bayaran dibuat dalam Ringgit ikut kadar tukaran pada tarikh invois — jumlah RM anggaran ada di sebelah setiap harga.' },
      { q: 'Berapa lama sebenarnya?', a: 'KILAT 7 hari. ASAS 3–4 minggu. OPERASI 2–3 bulan bergantung berapa banyak yang nak dipindahkan. Tarikh dikunci bertulis sebelum mula.' },
      { q: 'Siapa punya sistem tu nanti?', a: 'Awak. Bila bayaran penuh selesai, kod dan data jadi milik awak sepenuhnya. Saya tak kunci awak dalam mana-mana platform.' },
      { q: 'Kalau saya tak puas hati?', a: 'Skop dikunci bertulis sebelum mula, dan ada 2 pusingan pindaan termasuk dalam setiap pakej. Kalau hasil tak ikut skop yang dipersetujui, saya baiki sampai betul.' },
      { q: 'Saya kena bayar hosting berasingan?', a: 'Ya, dan ia atas nama awak sendiri — bukan saya. Biasanya percuma hingga sangat murah untuk bisnes kecil. Saya tak mark-up kos hosting.' },
      { q: 'Saya kedai makan, sesuai tak?', a: 'Bergantung apa yang awak nak. Kekuatan saya kedai runcit, retail dan distributor. Untuk kedai makan, bahagian yang saya paling boleh tolong ialah mencocokkan duit masuk dari GrabFood, foodpanda dan ShopeeFood dengan jualan sebenar — masalah yang sama dah saya selesaikan untuk Shopee dan TikTok.' },
    ],
  },
  contact: {
    heading: 'Cerita saya masalah awak',
    body: (p) => `Panggilan 30 minit, $${p} — dan ia percuma kalau awak teruskan dengan mana-mana pakej.`,
    wa: 'WhatsApp saya',
    waMsg: 'Hi, saya nak tanya pasal servis bina sistem.',
  },
  footer: { back: '← Kembali ke laman utama', note: 'Harga dalam USD · anggaran RM pada kadar semasa' },
}

const en = {
  nav: { home: 'Home' },
  hero: {
    label: 'Services',
    l1: 'Stock in a spreadsheet.',
    l2: 'Orders in WhatsApp.',
    l3: 'Reports in your head.',
    sub: 'Your business runs — but half your day goes to work a machine should be doing. I build the systems that take that work away.',
    cta1: 'See packages',
    cta2: 'See a real example',
  },
  about: {
    h1: "I'm not an agency. I'm a ",
    hAccent: 'shop owner',
    h2: ' who built his own systems for his own shop.',
    p1: 'Point of sale, stock, costing, payroll, Shopee & TikTok integration — I built all of it for 10 CAMP, and it runs every single day. I don\'t guess at retail problems. I live with them: dead stock, thin margins, staff picking the wrong item, marketplace payouts landing late.',
    p2: 'That\'s why we can talk about your business instead of talking about technology.',
  },
  proof: {
    label: 'Proof',
    heading: 'Systems that are actually in use',
    items: [
      {
        name: '10 CAMP',
        role: 'Camping gear retailer — my own business',
        body: 'POS, inventory, costing, payroll, reporting and Shopee & TikTok integration. Built in-house, used daily by my staff. We left subscription platforms entirely.',
        stats: [
          { v: '600+', l: 'products managed' },
          { v: '7 days', l: 'store open' },
          { v: '2 marketplaces', l: 'stock synced' },
        ],
      },
      {
        name: 'Shedan Bunga',
        role: 'Flower & beadwork boutique',
        body: 'A storefront that pulls straight from the POS inventory — change stock once, the website follows. No second place to keep updated.',
        stats: [
          { v: 'LIVE', l: 'shedanbunga.com' },
          { v: '1 source', l: 'of stock data' },
        ],
      },
    ],
  },
  steps: {
    label: 'How it works',
    items: [
      { no: '01', title: 'Diagnose', body: 'A 30-minute call. I listen to how you work today, then tell you straight which parts waste the most time — and what to fix first.' },
      { no: '02', title: 'Build', body: 'Scope is locked in writing before I start. You know what you get, when it lands, and what it costs. No surprise invoice at the end.' },
      { no: '03', title: 'Maintain', body: 'Once it ships you can take a monthly plan so someone is there when a platform changes or a bug shows up. Optional, never required.' },
    ],
  },
  demo3d: {
    label: '3D demo',
    heading: 'What you are actually buying',
    sub: 'Every system I build sits on the same 4 layers. Drag the model to spin it, tap any layer to see what it does.',
    hint: 'Drag to spin · tap a layer',
    idle: 'Every layer is tappable. Start from the top: that is what your customers see first. The deeper you go, the closer you get to the engine of your business.',
    incl: 'Included in',
    ctaPakej: 'See packages',
    fail: 'This device cannot render 3D. The system layers are described alongside.',
    note: 'Illustrative model: the real shape of the system follows your business.',
    layers: [
      { name: 'Storefront', desc: 'What customers see: catalogue, prices, order form. Fast and phone-first, because your customers are not sitting at a laptop.', pakej: ['KILAT', 'ASAS'] },
      { name: 'Back office', desc: 'Where your staff work: incoming orders, stock, job status. The system remembers, so your head does not have to.', pakej: ['ASAS', 'OPERASI'] },
      { name: 'AI & automation', desc: 'Repetitive work runs itself: daily reports, low-stock alerts, WhatsApp replies to common questions.', pakej: ['OPERASI'] },
      { name: 'Data', desc: 'One database under every layer. The same numbers in the shop, on your phone, in reports. No second version of the truth.', pakej: ['ASAS', 'OPERASI'] },
    ],
  },
  pkg: {
    label: 'Packages',
    heading: 'Start small. Move up once you see it working.',
    startHere: 'Start here',
    forWho: 'Who it\'s for',
    excludes: 'Not included',
    from: 'from',
    detail: 'Details & demo',
    footnote: 'Prices in USD. Malaysian clients pay in Ringgit at the rate on the invoice date. 50% deposit before work starts. Hosting & domain stay in your own name — I don\'t mark them up.',
    diagnosis: {
      title: 'Diagnostic Session',
      meta: '30 minutes · Free if you take any package',
      points: [
        'A 30-minute call — I ask how your business actually runs today',
        'I tell you the 3 things wasting the most of your time',
        'A 3-point summary sent to you on WhatsApp after the call',
        'Take that summary and build it yourself if you want — no strings',
      ],
    },
    items: [
      {
        id: 'kilat', no: '01', name: 'KILAT', best: true,
        tagline: 'One manual job → one tool',
        duration: 'Delivered in 7 days',
        for: 'You have one painful manual job every week',
        gets: [
          'One working tool with its own link — opens on phone or laptop, nothing to install',
          'Your existing data brought in — Excel, Google Sheets, WhatsApp lists',
          'Product photos built into the tool where you have them',
          'Automatic output — PDF, Excel/CSV, or text ready to paste into WhatsApp',
          '30-minute training plus a recording you can rewatch any time',
          '30 days of support — anything breaks, I fix it free',
        ],
        excludes: [
          'Multiple staff logins with different permissions',
          'Integration with Shopee / TikTok / an existing POS',
          'More than one tool',
        ],
      },
      {
        id: 'asas', no: '02', name: 'ASAS',
        tagline: 'Website + one internal system',
        duration: '3–4 weeks',
        for: 'No website yet, or the old one has gone stale',
        gets: [
          'A 5–8 section website — fast, good on phones, basic SEO, WhatsApp button',
          'One internal system: bookings, light inventory, orders or purchase orders',
          'Admin login so you run it yourself',
          '2 hours of staff training plus video guides',
          '60 days of support',
        ],
        excludes: ['Marketplace integration (priced separately)', 'Mobile app'],
      },
      {
        id: 'operasi', no: '03', name: 'OPERASI', from: true,
        tagline: 'Full business system',
        duration: '2–3 months',
        for: 'Stock, staff and money have all outgrown the spreadsheet',
        gets: [
          'POS, inventory, orders, costing and reporting in one system',
          'Multiple users with role-based permissions',
          'Marketplace integration with two-way stock updates',
          'Your old data migrated into the new system',
          'Billed in phases: 30% start · 30% midpoint · 40% handover',
          '90 days of support',
        ],
        excludes: [],
      },
    ],
  },
  example: {
    label: 'Real example · KILAT package',
    heading: 'Supplier catalogue → Purchase Order',
    beforeLabel: 'Before',
    before: 'The catalogue lived in a Google Sheet. 122 products. Every photo meant opening a separate link. Purchase orders were typed by hand in WhatsApp — wrong SKUs, missed quantities.',
    beforeBig: '~45 min', beforeSmall: 'per order',
    afterLabel: 'After',
    after: 'Pick items like online shopping with photos right there, then one tap turns it into a Purchase Order PDF ready to send to the supplier.',
    afterBig: '5 min', afterSmall: 'zero typos',
    shots: [
      { t: 'Pick items', b: '122 products, 531 photos, search and category filters. The running total updates as you pick.' },
      { t: 'PO ready', b: 'One tap produces a PDF with photos — SKUs, quantities, prices and signature blocks included.' },
    ],
    note: 'Real work, shipped and used daily — not a mock-up.',
  },
  retainer: {
    label: 'After launch',
    heading: 'Monthly plans — optional, never required',
    intro: 'After a system ships, things keep happening — platforms change how they work, hosting needs renewing, staff ask for a new report. A monthly plan means someone is looking after it without you asking the price every time.',
    perMonth: '/month',
    approx: 'per month',
    plans: [
      { name: 'Maintain', points: 'Hosting monitored, backups, uptime checks, small bug fixes, 2 hours of work' },
      { name: 'Grow', points: '8 hours of work a month, monthly report, small additions, priority on bugs' },
      { name: 'Ops Partner', points: '20 hours, direct WhatsApp line to me, monthly strategy call' },
    ],
    footnote: 'Six-month minimum. Unused hours don\'t roll over to the next month.',
  },
  faq: {
    label: 'Common questions',
    items: [
      { q: 'Why are prices in USD?', a: 'I take clients from outside Malaysia too, so prices are listed in USD. Malaysian clients pay in Ringgit at the exchange rate on the invoice date — the approximate RM figure sits next to every price.' },
      { q: 'How long does it really take?', a: 'KILAT is 7 days. ASAS is 3–4 weeks. OPERASI is 2–3 months depending on how much old data has to move across. Dates are locked in writing before work starts.' },
      { q: 'Who owns the system afterwards?', a: 'You do. Once the final payment clears, the code and the data are entirely yours. I don\'t lock you into any platform.' },
      { q: 'What if I\'m not happy with it?', a: 'Scope is locked in writing before I start, and every package includes 2 rounds of revisions. If the result doesn\'t match the agreed scope, I keep working until it does.' },
      { q: 'Do I pay for hosting separately?', a: 'Yes, and it stays in your name — not mine. For a small business it\'s usually free to very cheap. I don\'t mark up hosting costs.' },
      { q: 'I run a restaurant — is this for me?', a: 'It depends what you need. My strength is retail, grocery and distribution. For food businesses, the part I can help with most is reconciling the money coming in from GrabFood, foodpanda and ShopeeFood against actual sales — the same problem I already solved for Shopee and TikTok.' },
    ],
  },
  contact: {
    heading: 'Tell me what\'s broken',
    body: (p) => `A 30-minute call, $${p} — and it's free if you go ahead with any package.`,
    wa: 'WhatsApp me',
    waMsg: 'Hi, I\'d like to ask about your system-building services.',
  },
  footer: { back: '← Back to home', note: 'Prices in USD · RM figures approximate at current rate' },
}

export const COPY = { ms, en }
export const copyFor = (lang) => COPY[langFor(lang)]
