// ============================================================
// SERVIS — kandungan halaman terperinci setiap pakej (/servis/:slug).
// Dwibahasa ms/en. Demo interaktif ambil data contoh dari sini juga.
// Semua nombor dalam demo = REKAAN untuk tunjuk rupa, bukan data sebenar.
// ============================================================

export const SLUGS = ['kilat', 'asas', 'operasi']

// ---- data contoh untuk demo (tak berubah ikut bahasa) ----
// Barang runcit biasa supaya mana-mana peniaga nampak diri dia dalam contoh.
export const DEMO_ITEMS = [
  { sku: 'BRS-005', name: { ms: 'Beras Super 5kg', en: 'Rice 5kg' }, price: 26.5, unit: { ms: 'kampit', en: 'bag' } },
  { sku: 'MYK-001', name: { ms: 'Minyak Masak 1L', en: 'Cooking Oil 1L' }, price: 7.9, unit: { ms: 'botol', en: 'bottle' } },
  { sku: 'GLA-1KG', name: { ms: 'Gula Halus 1kg', en: 'Sugar 1kg' }, price: 3.4, unit: { ms: 'paket', en: 'pack' } },
  { sku: 'TPG-500', name: { ms: 'Tepung Gandum 500g', en: 'Flour 500g' }, price: 2.8, unit: { ms: 'paket', en: 'pack' } },
  { sku: 'MGI-005', name: { ms: 'Mi Segera 5s', en: 'Instant Noodles 5s' }, price: 4.6, unit: { ms: 'pek', en: 'pack' } },
  { sku: 'SUS-397', name: { ms: 'Susu Pekat 397g', en: 'Condensed Milk 397g' }, price: 4.2, unit: { ms: 'tin', en: 'tin' } },
]

export const DEMO_DASH = {
  stats: [
    { key: 'sales', v: 'RM 3,480', d: '+12%' },
    { key: 'orders', v: '47', d: '+5' },
    { key: 'low', v: '9', d: null },
    { key: 'profit', v: 'RM 812', d: '23%' },
  ],
  bars: [42, 58, 35, 71, 64, 88, 96],
  lowStock: [
    { sku: 'BRS-005', name: { ms: 'Beras Super 5kg', en: 'Rice 5kg' }, left: 3, need: 20 },
    { sku: 'MYK-001', name: { ms: 'Minyak Masak 1L', en: 'Cooking Oil 1L' }, left: 5, need: 24 },
    { sku: 'SUS-397', name: { ms: 'Susu Pekat 397g', en: 'Condensed Milk 397g' }, left: 2, need: 36 },
  ],
}

const kilat = {
  ms: {
    kicker: 'Pakej 01',
    name: 'KILAT',
    promise: 'Satu kerja manual yang menyakitkan — saya tukar jadi alat, siap dalam 7 hari.',
    sub: 'Bukan sistem besar. Satu alat yang buat satu kerja, betul-betul elok. Awak guna hari pertama juga.',
    signsLabel: 'Tanda awak perlukan ini',
    signs: [
      'Ada satu kerja yang awak ulang setiap minggu, guna tangan, dan awak benci buat',
      'Maklumat awak duduk dalam Excel atau Google Sheet dan susah nak guna masa sibuk',
      'Awak taip benda yang sama berulang kali dalam WhatsApp',
      'Kadang tersalah taip, tersalah kira, atau tertinggal barang',
    ],
    getsLabel: 'Apa yang awak dapat',
    getsGroups: [
      {
        title: 'Alat itu sendiri',
        items: [
          'Satu alat dengan link sendiri — buka atas telefon, tablet atau laptop',
          'Tak perlu install apa-apa, tak perlu akaun, tak perlu ajar staf guna app baru',
          'Elok atas skrin telefon (kebanyakan orang guna atas telefon)',
          'Pilihan awak tersimpan sendiri — tutup, buka balik, kerja masih ada',
        ],
      },
      {
        title: 'Data awak masuk sekali',
        items: [
          'Saya ambil senarai sedia ada awak — Excel, Google Sheet, PDF, atau senarai WhatsApp',
          'Saya kemas dan susun, awak tak perlu taip semula',
          'Kalau ada gambar produk, saya masukkan sekali',
        ],
      },
      {
        title: 'Hasil yang boleh terus dihantar',
        items: [
          'PDF kemas siap cetak atau hantar kepada pembekal / pelanggan',
          'Fail Excel/CSV kalau awak nak simpan rekod',
          'Teks siap paste terus ke WhatsApp',
        ],
      },
      {
        title: 'Selepas siap',
        items: [
          'Latihan 30 minit — saya tunjuk cara guna, awak cuba depan saya',
          'Rakaman video latihan supaya staf baru boleh tengok balik',
          'Sokongan 30 hari — apa-apa rosak, saya baiki, tak kira berapa kali',
        ],
      },
    ],
    demoLabel: 'Cuba sendiri',
    demoHeading: 'Masukkan nama kedai awak',
    demoSub: 'Pilih barang, tengok Purchase Order awak terbentuk terus. Ini paparan contoh — tiada apa-apa disimpan.',
    demoField: 'Nama kedai / syarikat awak',
    demoPlaceholder: 'cth: Kedai Runcit Maju Jaya',
    demoPick: 'Pilih barang',
    demoResult: 'Purchase Order awak',
    demoEmpty: 'Pilih sekurang-kurangnya satu barang di sebelah untuk lihat hasilnya.',
    demoNote: 'Yang sebenar akan guna barang dan pembekal awak sendiri, bukan senarai contoh ni.',
    timelineLabel: '7 hari, langkah demi langkah',
    timeline: [
      { d: 'Hari 1', t: 'Kita cakap', b: 'Panggilan 30 minit. Awak tunjuk cara awak buat kerja tu sekarang. Saya tanya sampai saya faham betul-betul.' },
      { d: 'Hari 2', t: 'Data awak', b: 'Awak hantar fail atau senarai sedia ada. Saya kemas dan sahkan dengan awak kalau ada yang pelik.' },
      { d: 'Hari 3–5', t: 'Saya bina', b: 'Awak tak perlu buat apa-apa. Saya hantar link separuh siap supaya awak boleh komen awal.' },
      { d: 'Hari 6', t: 'Awak cuba', b: 'Awak guna betul-betul untuk kerja sebenar. Apa yang janggal, saya betulkan.' },
      { d: 'Hari 7', t: 'Serah', b: 'Latihan 30 minit, rakaman video, dan link kekal milik awak. Sokongan 30 hari bermula.' },
    ],
    exLabel: 'Tak termasuk dalam pakej ini',
    excludes: [
      'Login berasingan untuk ramai staf dengan hak akses berbeza',
      'Sambungan ke Shopee, TikTok, atau POS sedia ada',
      'Lebih daripada satu alat',
      'Website penuh untuk pelanggan',
    ],
    upsell: 'Perlukan mana-mana di atas? Itu pakej ASAS atau OPERASI.',
    faq: [
      { q: 'Saya tak reti teknologi. Boleh guna ke?', a: 'Boleh. Alat ni dibuat untuk orang yang sibuk jaga kedai, bukan untuk orang IT. Kalau awak boleh guna WhatsApp, awak boleh guna ini. Latihan 30 minit tu pun biasanya lebih daripada cukup.' },
      { q: 'Data saya selamat?', a: 'Alat ni milik awak sepenuhnya. Saya tak jual data, tak kongsi dengan sesiapa. Kalau kerja tu tak perlukan internet, saya boleh buat ia jalan tanpa sambungan langsung.' },
      { q: 'Kalau saya nak tambah benda lepas siap?', a: 'Boleh. Perubahan kecil dalam 30 hari pertama biasanya saya buat terus. Tambahan besar jadi kerja berasingan, dan saya beritahu harga sebelum mula — tiada bil terkejut.' },
      { q: 'Kenapa 7 hari je? Bunyi macam terlalu cepat.', a: 'Sebab skopnya sengaja kecil — satu kerja, satu alat. Saya juga guna semula komponen yang saya dah bina sebelum ni. Yang lambat biasanya bukan kerja bina, tapi skop yang tak pernah berhenti membesar.' },
    ],
  },
  en: {
    kicker: 'Package 01',
    name: 'KILAT',
    promise: 'One painful manual job — I turn it into a tool, delivered in 7 days.',
    sub: 'Not a big system. One tool that does one job properly. You use it from day one.',
    signsLabel: 'Signs you need this',
    signs: [
      'There\'s one task you repeat every week, by hand, and you dread it',
      'Your information lives in a spreadsheet that\'s painful to use when you\'re busy',
      'You type the same thing over and over in WhatsApp',
      'Things get mistyped, miscounted, or missed entirely',
    ],
    getsLabel: 'What you get',
    getsGroups: [
      {
        title: 'The tool itself',
        items: [
          'One tool with its own link — opens on phone, tablet or laptop',
          'Nothing to install, no accounts to create, no new app to teach staff',
          'Built to work on a phone screen first, because that\'s what people actually use',
          'Your work saves itself — close it, come back, everything is still there',
        ],
      },
      {
        title: 'Your data goes in once',
        items: [
          'I take your existing list — Excel, Google Sheets, PDF, or a WhatsApp list',
          'I clean and structure it, so you never retype anything',
          'Product photos included where you have them',
        ],
      },
      {
        title: 'Output you can send immediately',
        items: [
          'A clean PDF ready to print or send to a supplier or customer',
          'An Excel/CSV file if you keep your own records',
          'Text ready to paste straight into WhatsApp',
        ],
      },
      {
        title: 'After delivery',
        items: [
          '30-minute training — I show you, then you try it in front of me',
          'A recording of that session so new staff can watch it later',
          '30 days of support — anything breaks, I fix it, however many times',
        ],
      },
    ],
    demoLabel: 'Try it yourself',
    demoHeading: 'Put your shop\'s name in',
    demoSub: 'Pick a few items and watch your Purchase Order build itself. This is a preview — nothing is saved.',
    demoField: 'Your shop / company name',
    demoPlaceholder: 'e.g. Maju Jaya Mini Market',
    demoPick: 'Pick items',
    demoResult: 'Your Purchase Order',
    demoEmpty: 'Pick at least one item on the left to see the result.',
    demoNote: 'The real one uses your own products and suppliers, not this sample list.',
    timelineLabel: 'Seven days, step by step',
    timeline: [
      { d: 'Day 1', t: 'We talk', b: 'A 30-minute call. You show me how you do the job today. I ask questions until I properly understand it.' },
      { d: 'Day 2', t: 'Your data', b: 'You send your existing file or list. I clean it up and check anything that looks odd with you.' },
      { d: 'Day 3–5', t: 'I build', b: 'Nothing needed from you. I send a half-finished link so you can react early.' },
      { d: 'Day 6', t: 'You test it', b: 'You use it on real work. Anything awkward, I fix.' },
      { d: 'Day 7', t: 'Handover', b: '30-minute training, a video recording, and the link is yours. 30 days of support starts.' },
    ],
    exLabel: 'Not included in this package',
    excludes: [
      'Separate logins for multiple staff with different permissions',
      'Integration with Shopee, TikTok, or an existing POS',
      'More than one tool',
      'A full public-facing website',
    ],
    upsell: 'Need any of the above? That\'s the ASAS or OPERASI package.',
    faq: [
      { q: 'I\'m not technical. Can I still use it?', a: 'Yes. It\'s built for someone busy running a shop, not for an IT person. If you can use WhatsApp, you can use this. The 30-minute training is usually more than enough.' },
      { q: 'Is my data safe?', a: 'The tool is entirely yours. I don\'t sell data and I don\'t share it with anyone. If the job doesn\'t need the internet, I can build it to work with no connection at all.' },
      { q: 'What if I want to add something after it\'s done?', a: 'You can. Small changes in the first 30 days I usually just do. Bigger additions become separate work, and I tell you the price before starting — no surprise invoice.' },
      { q: 'Why only 7 days? That sounds too fast.', a: 'Because the scope is deliberately small — one job, one tool. I also reuse components I\'ve already built. What usually makes projects slow isn\'t the building, it\'s scope that never stops growing.' },
    ],
  },
}

const asas = {
  ms: {
    kicker: 'Pakej 02',
    name: 'ASAS',
    promise: 'Website yang orang jumpa awak, plus satu sistem dalaman yang awak guna setiap hari.',
    sub: 'Muka depan untuk pelanggan, dan bahagian belakang untuk awak urus kerja. Dua-dua siap sekali.',
    signsLabel: 'Tanda awak perlukan ini',
    signs: [
      'Orang tanya "ada website tak?" dan awak terpaksa hantar link Facebook',
      'Website lama awak dah bertahun tak dijaga, atau dah hilang terus',
      'Tempahan atau order masuk bersepah dalam WhatsApp dan awak hilang jejak',
      'Awak nak nampak kemas bila berurusan dengan pelanggan atau pembekal besar',
    ],
    getsLabel: 'Apa yang awak dapat',
    getsGroups: [
      {
        title: 'Website untuk pelanggan',
        items: [
          '5–8 seksyen: siapa awak, apa awak jual, kenapa pilih awak, cara hubungi',
          'Laju dan kemas atas telefon — kebanyakan pelanggan awak guna telefon',
          'SEO asas supaya nama kedai awak keluar bila orang cari dalam Google',
          'Butang WhatsApp besar — pelanggan tekan, terus masuk chat awak',
          'Gambar dan teks awak sendiri, bukan gambar stok yang orang lain pun guna',
        ],
      },
      {
        title: 'Satu sistem dalaman',
        items: [
          'Pilih satu: tempahan, order, inventori ringkas, atau purchase order',
          'Login admin — awak tambah, ubah, padam sendiri tanpa panggil saya',
          'Senarai kemas yang boleh ditapis dan dicari',
          'Boleh keluarkan laporan atau senarai dalam PDF/Excel',
        ],
      },
      {
        title: 'Selepas siap',
        items: [
          'Latihan staf 2 jam',
          'Panduan video pendek untuk setiap kerja biasa',
          'Sokongan 60 hari',
        ],
      },
    ],
    demoLabel: 'Cuba sendiri',
    demoHeading: 'Masukkan nama kedai awak',
    demoSub: 'Tengok rupa muka depan website awak dan sistem dalaman awak. Ini paparan contoh — tiada apa-apa disimpan.',
    demoField: 'Nama kedai / syarikat awak',
    demoPlaceholder: 'cth: Kedai Runcit Maju Jaya',
    demoType: 'Jenis bisnes',
    demoTypes: [
      { id: 'runcit', label: 'Kedai runcit', tag: 'Barang harian, harga jujur', cta: 'Pesan via WhatsApp' },
      { id: 'makan', label: 'Kedai makan', tag: 'Masakan rumah setiap hari', cta: 'Tempah meja' },
      { id: 'butik', label: 'Butik', tag: 'Koleksi terhad, dijahit teliti', cta: 'Tengok koleksi' },
    ],
    demoSite: 'Muka depan (apa pelanggan nampak)',
    demoAdmin: 'Sistem dalaman (apa awak nampak)',
    demoNote: 'Warna, gambar dan ayat sebenar akan ikut jenama awak — ini cuma rangka.',
    timelineLabel: '3–4 minggu, langkah demi langkah',
    timeline: [
      { d: 'Minggu 1', t: 'Faham & skop', b: 'Kita kunci apa yang website perlu buat dan sistem mana yang paling berbaloi untuk awak.' },
      { d: 'Minggu 2', t: 'Reka bentuk', b: 'Saya tunjuk rupa sebenar sebelum bina penuh. Awak komen, saya ubah.' },
      { d: 'Minggu 3', t: 'Bina', b: 'Website dan sistem dibina. Awak dapat link untuk tengok kemajuan bila-bila.' },
      { d: 'Minggu 4', t: 'Uji & serah', b: 'Awak dan staf cuba betul-betul, saya betulkan, lepas tu latihan 2 jam dan serah.' },
    ],
    exLabel: 'Tak termasuk dalam pakej ini',
    excludes: [
      'Sambungan ke Shopee / TikTok / Lazada (jadi tambahan berasingan)',
      'Aplikasi telefon untuk muat turun',
      'Lebih daripada satu sistem dalaman',
      'Sistem bayaran dalam talian',
    ],
    upsell: 'Perlukan semua sekali dalam satu sistem? Itu pakej OPERASI.',
    faq: [
      { q: 'Nama domain dan hosting macam mana?', a: 'Atas nama awak sendiri, bukan nama saya — supaya awak tak terikat dengan saya. Untuk bisnes kecil kosnya biasanya percuma hingga sangat murah. Saya tolong setupkan dan saya tak ambil untung atasnya.' },
      { q: 'Saya boleh ubah teks sendiri lepas ni?', a: 'Untuk sistem dalaman, ya — awak ada login admin. Untuk teks website, perubahan kecil saya buat percuma dalam tempoh sokongan. Kalau awak nak ubah sendiri sepenuhnya, cakap awal, saya boleh bina cara tu.' },
      { q: 'Kalau nanti saya nak naik ke sistem penuh?', a: 'Kerja pakej ni tak terbuang. Website dan sistem awak jadi asas, dan kita tambah bahagian lain di atasnya. Awak bayar beza, bukan mula semula.' },
    ],
  },
  en: {
    kicker: 'Package 02',
    name: 'ASAS',
    promise: 'A website so people can find you, plus one internal system you actually use daily.',
    sub: 'A front for customers and a back for you. Both delivered together.',
    signsLabel: 'Signs you need this',
    signs: [
      'People ask "do you have a website?" and you send them a Facebook link',
      'Your old site hasn\'t been touched in years, or has disappeared entirely',
      'Bookings or orders arrive scattered across WhatsApp and you lose track',
      'You want to look credible when dealing with bigger customers or suppliers',
    ],
    getsLabel: 'What you get',
    getsGroups: [
      {
        title: 'A website for your customers',
        items: [
          '5–8 sections: who you are, what you sell, why you, how to reach you',
          'Fast and clean on a phone — that\'s where most of your customers are',
          'Basic SEO so your name shows up when people search Google',
          'A big WhatsApp button — customers tap it and land in your chat',
          'Your own photos and words, not stock images everyone else uses',
        ],
      },
      {
        title: 'One internal system',
        items: [
          'Pick one: bookings, orders, light inventory, or purchase orders',
          'Admin login — you add, edit and delete without calling me',
          'A clean list you can search and filter',
          'Export a report or list as PDF/Excel',
        ],
      },
      {
        title: 'After delivery',
        items: [
          '2 hours of staff training',
          'Short video guides for each routine task',
          '60 days of support',
        ],
      },
    ],
    demoLabel: 'Try it yourself',
    demoHeading: 'Put your shop\'s name in',
    demoSub: 'See how your front page and your internal system would look. This is a preview — nothing is saved.',
    demoField: 'Your shop / company name',
    demoPlaceholder: 'e.g. Maju Jaya Mini Market',
    demoType: 'Type of business',
    demoTypes: [
      { id: 'runcit', label: 'Grocery shop', tag: 'Everyday goods, honest prices', cta: 'Order on WhatsApp' },
      { id: 'makan', label: 'Restaurant', tag: 'Home cooking, every day', cta: 'Book a table' },
      { id: 'butik', label: 'Boutique', tag: 'Small batches, carefully made', cta: 'View collection' },
    ],
    demoSite: 'Front page (what customers see)',
    demoAdmin: 'Internal system (what you see)',
    demoNote: 'Real colours, photos and words follow your brand — this is only the skeleton.',
    timelineLabel: '3–4 weeks, step by step',
    timeline: [
      { d: 'Week 1', t: 'Understand & scope', b: 'We lock down what the site must do and which internal system earns its keep for you.' },
      { d: 'Week 2', t: 'Design', b: 'I show you the real look before building it fully. You react, I adjust.' },
      { d: 'Week 3', t: 'Build', b: 'Site and system get built. You get a link to check progress any time.' },
      { d: 'Week 4', t: 'Test & hand over', b: 'You and your staff use it for real, I fix what\'s awkward, then 2 hours of training and handover.' },
    ],
    exLabel: 'Not included in this package',
    excludes: [
      'Shopee / TikTok / Lazada integration (priced separately)',
      'A downloadable mobile app',
      'More than one internal system',
      'Online payment processing',
    ],
    upsell: 'Need all of it in one system? That\'s the OPERASI package.',
    faq: [
      { q: 'What about the domain and hosting?', a: 'They stay in your name, not mine — so you\'re never stuck with me. For a small business the cost is usually free to very cheap. I set it up and take no cut of it.' },
      { q: 'Can I edit the text myself afterwards?', a: 'For the internal system, yes — you have an admin login. For website text, small changes I make free during the support window. If you want full self-editing, say so early and I\'ll build it that way.' },
      { q: 'What if I want to move up to a full system later?', a: 'None of this work is wasted. Your site and system become the foundation and we build the rest on top. You pay the difference, not the whole thing again.' },
    ],
  },
}

const operasi = {
  ms: {
    kicker: 'Pakej 03',
    name: 'OPERASI',
    promise: 'Stok, order, kos dan laporan — semua dalam satu sistem yang awak miliki.',
    sub: 'Ini yang saya bina untuk kedai saya sendiri. Bukan teori, bukan demo — benda yang staf saya guna setiap hari.',
    signsLabel: 'Tanda awak perlukan ini',
    signs: [
      'Awak tak tahu barang mana yang betul-betul untung dan mana yang makan duit awak',
      'Stok atas sistem tak sama dengan stok atas rak',
      'Setiap bulan awak habiskan berhari-hari kira-kira sebelum tahu untung rugi',
      'Awak bayar subscription bulanan untuk platform yang awak dah terlebih besar',
      'Staf ramai, dan awak perlu kawal siapa boleh tengok apa',
    ],
    getsLabel: 'Apa yang awak dapat',
    getsGroups: [
      {
        title: 'Satu sistem, semua bahagian',
        items: [
          'Kaunter jualan (POS) yang staf boleh guna tanpa latihan panjang',
          'Inventori yang tolak stok sendiri bila barang terjual',
          'Order dan penghantaran dalam satu tempat',
          'Kos sebenar setiap barang — termasuk kos hantar dan duti',
          'Laporan untung rugi yang awak boleh percaya',
        ],
      },
      {
        title: 'Kawalan staf',
        items: [
          'Banyak pengguna, hak akses ikut jawatan',
          'Kasir nampak apa yang kasir perlu, bukan kos dan margin awak',
          'Rekod siapa buat apa dan bila',
        ],
      },
      {
        title: 'Sambungan luar',
        items: [
          'Shopee, TikTok atau Lazada — stok kemas kini dua hala',
          'Order marketplace masuk sekali dengan order kedai',
          'Duit settlement dipadan dengan jualan sebenar',
        ],
      },
      {
        title: 'Pindah masuk',
        items: [
          'Data lama awak dipindahkan — Excel, sistem lama, atau platform subscription',
          'Saya sahkan angka dengan awak sebelum kita tukar sepenuhnya',
          'Kedai awak tak berhenti beroperasi masa pertukaran',
        ],
      },
    ],
    demoLabel: 'Cuba sendiri',
    demoHeading: 'Masukkan nama kedai awak',
    demoSub: 'Tengok rupa papan pemuka awak pada pagi hari biasa. Angka di bawah semuanya rekaan — ini paparan contoh sahaja.',
    demoField: 'Nama kedai / syarikat awak',
    demoPlaceholder: 'cth: Kedai Runcit Maju Jaya',
    demoGreet: 'Selamat pagi',
    demoStats: {
      sales: 'Jualan hari ini', orders: 'Order belum pack',
      low: 'Stok hampir habis', profit: 'Untung hari ini',
    },
    demoChart: 'Jualan 7 hari lepas',
    demoLow: 'Perlu order semula',
    demoLeft: 'tinggal',
    demoNeed: 'cadang order',
    demoNote: 'Yang sebenar guna angka kedai awak, dan boleh dibuka dari telefon awak setiap pagi.',
    timelineLabel: '2–3 bulan, ikut fasa',
    timeline: [
      { d: 'Fasa 1', t: 'Kira & rancang', b: 'Saya masuk dalam cara kerja awak sekarang, kira apa yang patut, dan kunci apa yang dibina dahulu. Bil 30%.' },
      { d: 'Fasa 2', t: 'Teras', b: 'Stok, jualan dan kos dibina dan diuji dengan data sebenar awak. Bil 30%.' },
      { d: 'Fasa 3', t: 'Sambungan', b: 'Marketplace, laporan dan hak akses staf. Pindah data lama masuk.' },
      { d: 'Fasa 4', t: 'Tukar & serah', b: 'Kita tukar sepenuhnya, saya ada sepanjang minggu pertama. Latihan penuh. Bil 40%.' },
    ],
    exLabel: 'Perkara yang biasa disalah faham',
    excludes: [
      'Ini bukan kerja seminggu — sistem sebesar ni ambil masa dan penglibatan awak',
      'Saya perlukan data awak yang sebenar, bukan anggaran',
      'Aplikasi telefon dan ejen AI adalah tambahan berasingan',
      'Perkakasan (mesin, printer, scanner) awak beli sendiri — saya cadangkan yang mana',
    ],
    upsell: 'Belum pasti perlu sebesar ini? Mula dengan KILAT dahulu, naik bila awak dah nampak hasilnya.',
    faq: [
      { q: 'Kenapa saya patut pilih awak dan bukan sistem siap pakai?', a: 'Sistem siap pakai bagus kalau bisnes awak sama macam bisnes orang lain. Saya bina 10 CAMP sendiri sebab tiada platform yang faham cara kami bekerja, dan kami berhenti bayar subscription selama-lamanya. Kalau sistem siap pakai memang muat untuk awak, saya akan cakap terus — lebih baik awak jimat duit daripada saya ambil projek yang tak sepatutnya.' },
      { q: 'Kalau awak hilang, apa jadi pada sistem saya?', a: 'Kod dan data milik awak sepenuhnya selepas bayaran penuh. Semuanya didokumenkan supaya developer lain boleh sambung. Saya tak kunci awak pada mana-mana platform, dan saya tak simpan apa-apa yang awak tak boleh capai.' },
      { q: 'Kedai saya tak boleh tutup untuk tukar sistem.', a: 'Tak perlu tutup. Kita jalan dua sistem serentak dalam tempoh peralihan, saya sahkan angka padan, baru kita matikan yang lama. Itu cara saya buat untuk kedai saya sendiri.' },
      { q: 'Berapa saya jimat sebenarnya?', a: 'Bergantung bisnes awak. Dua tempat biasa: subscription platform yang awak bayar setiap bulan selama-lamanya, dan jam kerja admin yang hilang setiap minggu. Dalam sesi diagnosis, kita kira nombor awak sendiri — bukan nombor pukul rata.' },
    ],
  },
  en: {
    kicker: 'Package 03',
    name: 'OPERASI',
    promise: 'Stock, orders, costing and reporting — one system, and you own it.',
    sub: 'This is what I built for my own shop. Not theory, not a demo — the thing my staff use every day.',
    signsLabel: 'Signs you need this',
    signs: [
      'You don\'t know which products actually make money and which quietly eat it',
      'Stock in the system doesn\'t match stock on the shelf',
      'Every month you lose days to arithmetic before you know if you made a profit',
      'You\'re paying a monthly subscription for a platform you\'ve outgrown',
      'You have several staff and need to control who sees what',
    ],
    getsLabel: 'What you get',
    getsGroups: [
      {
        title: 'One system, all the parts',
        items: [
          'A point of sale your staff can use without lengthy training',
          'Inventory that decrements itself as things sell',
          'Orders and fulfilment in one place',
          'True cost per product — including freight and duties',
          'Profit and loss reporting you can actually trust',
        ],
      },
      {
        title: 'Staff control',
        items: [
          'Multiple users with role-based permissions',
          'Cashiers see what cashiers need, not your costs and margins',
          'A record of who did what, and when',
        ],
      },
      {
        title: 'Outside connections',
        items: [
          'Shopee, TikTok or Lazada — stock updates both ways',
          'Marketplace orders land beside your in-store orders',
          'Settlement money reconciled against actual sales',
        ],
      },
      {
        title: 'Moving in',
        items: [
          'Your old data migrated — spreadsheets, a legacy system, or a subscription platform',
          'I reconcile the numbers with you before we switch fully',
          'Your shop keeps trading throughout the changeover',
        ],
      },
    ],
    demoLabel: 'Try it yourself',
    demoHeading: 'Put your shop\'s name in',
    demoSub: 'See what your dashboard looks like on an ordinary morning. Every number below is invented — this is a preview only.',
    demoField: 'Your shop / company name',
    demoPlaceholder: 'e.g. Maju Jaya Mini Market',
    demoGreet: 'Good morning',
    demoStats: {
      sales: 'Sales today', orders: 'Orders to pack',
      low: 'Running low', profit: 'Profit today',
    },
    demoChart: 'Last 7 days',
    demoLow: 'Needs reordering',
    demoLeft: 'left',
    demoNeed: 'suggested order',
    demoNote: 'The real one uses your numbers, and opens on your phone every morning.',
    timelineLabel: '2–3 months, in phases',
    timeline: [
      { d: 'Phase 1', t: 'Count & plan', b: 'I get inside how you work today, count what needs counting, and lock what gets built first. 30% billed.' },
      { d: 'Phase 2', t: 'The core', b: 'Stock, sales and costing built and tested against your real data. 30% billed.' },
      { d: 'Phase 3', t: 'Connections', b: 'Marketplaces, reporting and staff permissions. Old data migrated in.' },
      { d: 'Phase 4', t: 'Switch & hand over', b: 'We cut over fully and I\'m present through the first week. Full training. 40% billed.' },
    ],
    exLabel: 'Things people commonly misunderstand',
    excludes: [
      'This isn\'t a one-week job — a system this size takes time and your involvement',
      'I need your real data, not estimates',
      'A mobile app and AI agents are separate additions',
      'Hardware (terminals, printers, scanners) you buy yourself — I\'ll tell you which',
    ],
    upsell: 'Not sure you need something this big? Start with KILAT and move up once you see it working.',
    faq: [
      { q: 'Why you instead of an off-the-shelf system?', a: 'Off-the-shelf is great when your business works like everyone else\'s. I built 10 CAMP\'s system myself because no platform understood how we actually work, and we stopped paying subscriptions forever. If an off-the-shelf product genuinely fits you, I\'ll tell you straight — better you save the money than I take a project I shouldn\'t.' },
      { q: 'What happens to my system if you disappear?', a: 'The code and data are entirely yours once paid. Everything is documented so another developer can pick it up. I don\'t lock you into any platform and I hold nothing you can\'t reach yourself.' },
      { q: 'My shop can\'t close for a system change.', a: 'It doesn\'t need to. We run both systems side by side through the transition, I verify the numbers match, and only then do we retire the old one. That\'s how I did it for my own shop.' },
      { q: 'How much do I actually save?', a: 'It depends on your business. Two usual places: the platform subscription you pay every month forever, and the admin hours that vanish each week. In the diagnostic session we work out your numbers, not an average.' },
    ],
  },
}

export const PAGES = { kilat, asas, operasi }
export const pageFor = (slug, lang) => (PAGES[slug] ? PAGES[slug][lang] || PAGES[slug].ms : null)
