export interface Student {
  id: number;
  name: string;
  ic: string;
  gender: 'L' | 'P';
  modules: (number | string)[]; // TP 1-6 or '-'
  overall: number | string;
  attendanceRate?: string;
  teacherRemarks?: string;
}

export interface SchoolMetadata {
  ministryHeader: string;
  school: string;
  address: string;
  state: string;
  date: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  teacherDesignation: string;
  principal: string;
  principalDesignation: string;
  class: string;
  academicYear: string;
  assessmentTerm: string;
  schoolCode?: string;
  schoolLogo?: string;
  kpmLogo?: string; // fallback
  kpmHeaderLogo?: string; // Header KPM logo (Jata Negara with text)
  kpmBodyLogo?: string;   // Body KPM logo (Blue oval KPM emblem)
  bpkLogo?: string;       // BPK logo
  reportFormat?: 'modern' | 'official_kpm';
}

export interface ModuleDefinition {
  id: number;
  code: string;
  title: string;
  englishTitle: string;
  descriptors: Record<number, string>;
}

export const INITIAL_METADATA: SchoolMetadata = {
  ministryHeader: "KEMENTERIAN PENDIDIKAN MALAYSIA",
  school: "SEKOLAH MENENGAH UNIVERSAL HUA XIA",
  address: "WISMA HUA XIA, JALAN SERI KEMBANGAN",
  state: "SELANGOR",
  date: "04/11/2026",
  subject: "PRINSIP PERAKAUNAN",
  subjectCode: "3756",
  teacher: "PN. NORSUZALINA",
  teacherDesignation: "GURU MATA PELAJARAN",
  principal: "EN. LAU LIK SHING",
  principalDesignation: "PENGETUA",
  class: "4 POLITE",
  academicYear: "2026",
  assessmentTerm: "Pentaksiran Akhir Sesi Akademik (PASA)",
  schoolCode: "BEA8651",
  schoolLogo: "/assets/aistudio/Hua_Xia_PS_Logo-single_with_R_b7d8ae72.png",
  kpmHeaderLogo: "/assets/aistudio/kpm-header_99ba0e3f.png",
  kpmBodyLogo: "/assets/aistudio/kpm-body_40f8f030.png",
  bpkLogo: "/assets/aistudio/bpl_471965f2.png",
  reportFormat: 'official_kpm'
};

export function getOverallTPStatement(tp: number | string): string {
  const num = Number(tp);
  switch (num) {
    case 6:
      return "Menguasai pengetahuan dan kemahiran perakaunan pada tahap cemerlang untuk mereka cipta dan menyelesaikan masalah secara kreatif dan inovatif serta berkeupayaan membimbing murid lain.";
    case 5:
      return "Menggunakan pengetahuan dan kemahiran perakaunan untuk menyelesaikan masalah yang kompleksdengan pelbagai kaedah";
    case 4:
      return "Menggunakan pengetahuan dan kemahiran perakaunan untuk melaksanakan tugasan mengikut prosedur secara sistematik dan beradab.";
    case 3:
      return "Menggunakan pengetahuan dan kemahiran perakaunan untuk melaksanakan sesuatu kemahiran pada suatu situasi standard.";
    case 2:
      return "Memahami konsep dan tatacara perakaunan serta berupaya menjelaskan fungsi dokumen dan buku catatan berkaitan.";
    case 1:
      return "Mengingat kembali konsep dan pengetahuan asas perakaunan.";
    default:
      return "Murid dinilai mengikut standard kurikulum kebangsaan.";
  }
}

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 1,
    code: "MODUL 1.0",
    title: "Pengenalan kepada Perakaunan",
    englishTitle: "Introduction to Accounting",
    descriptors: {
      1: "Mengingat kembali definisi perakaunan, fungsi dan subbidang perakaunan.",
      2: "Menjelaskan konsep asas, ciri-ciri kualitatif penyata kewangan dan etika profesion.",
      3: "Mengaplikasikan prinsip, andaian dan konvensyen perakaunan dalam situasi urus niaga.",
      4: "Menganalisis perbezaan entiti perniagaan serta tatacara kitaran perakaunan.",
      5: "Menilai amalan etika dan piawaian perakaunan entiti dengan tepat dan teratur.",
      6: "Merumuskan impak kepatuhan sistem perakaunan serta membimbing murid lain secara kreatif."
    }
  },
  {
    id: 2,
    code: "MODUL 2.0",
    title: "Klasifikasi Akaun dan Persamaan Perakaunan",
    englishTitle: "Classification of Accounts & Accounting Equation",
    descriptors: {
      1: "Mengenal pasti komponen aset, liabiliti, ekuiti pemilik, hasil dan belanja.",
      2: "Menerangkan kesan urus niaga terhadap persamaan perakaunan tanpa dan dengan hasil/belanja.",
      3: "Menghitung nilai aset, liabiliti dan ekuiti pemilik berpandukan urus niaga perniagaan.",
      4: "Mengklasifikasikan akaun ke dalam kategori betul dan melengkapkan jadual persamaan perakaunan.",
      5: "Menyediakan analisis persamaan perakaunan yang lengkap, tepat dan berstruktur.",
      6: "Menyelesaikan situasi urus niaga kompleks berkaitan klasifikasi akaun dengan cekap dan teliti."
    }
  },
  {
    id: 3,
    code: "MODUL 3.0",
    title: "Dokumen Perniagaan Sebagai Sumber Maklumat",
    englishTitle: "Business Documents as Information Source",
    descriptors: {
      1: "Menyenaraikan dokumen sumber dan dokumen bukan sumber perniagaan.",
      2: "Menerangkan fungsi setiap dokumen perniagaan dalam aliran transaksi.",
      3: "Memadankan dokumen perniagaan dengan catatan dalam Buku Catatan Pertama.",
      4: "Menganalisis maklumat dalam invois, nota debit, nota kredit dan resit rasmi secara terperinci.",
      5: "Menentusahkan kesahihan dan ketepatan aliran dokumen perniagaan tanpa ralat.",
      6: "Menjana kitaran aliran dokumen lengkap bagi perniagaan simulasi secara sistematik."
    }
  },
  {
    id: 4,
    code: "MODUL 4.0",
    title: "Buku Catatan Pertama",
    englishTitle: "Books of Prime Entry",
    descriptors: {
      1: "Menyatakan jenis-jenis Buku Catatan Pertama (Jurnal, Buku Tunai, Buku Tunai Runcit).",
      2: "Menerangkan kegunaan Jurnal Am, Jurnal Khas dan sistem panjar wang runcit.",
      3: "Merekod urus niaga daripada dokumen sumber ke dalam Jurnal dan Buku Tunai.",
      4: "Merekod urus niaga dalam pelbagai Buku Catatan Pertama dengan format yang tepat dan kemas.",
      5: "Menutup dan mengimbangkan Buku Catatan Pertama serta Buku Tunai Runcit secara cemerlang.",
      6: "Membimbing rakan dalam penyediaan Buku Catatan Pertama dengan standard profesional."
    }
  },
  {
    id: 5,
    code: "MODUL 5.0",
    title: "Lejar",
    englishTitle: "The Ledger",
    descriptors: {
      1: "Mengenal pasti bentuk Lejar Am dan Lejar Khas serta peraturan debit/kredit.",
      2: "Menerangkan maksud dan tatacara sistem catatan bergu bagi merekod akaun.",
      3: "Memindahkan catatan (posting) daripada Buku Catatan Pertama ke akaun lejar berkaitan.",
      4: "Mengimbangi akaun-akaun lejar pada akhir tempoh perakaunan dengan tepat.",
      5: "Menyediakan akaun kawalan penghutang dan pemiutang dengan format standard tanpa kesilapan.",
      6: "Menguasai sepenuhnya sistem catatan bergu dan membina lejar perniagaan yang kompleks."
    }
  },
  {
    id: 6,
    code: "MODUL 6.0",
    title: "Imbangan Duga",
    englishTitle: "Trial Balance",
    descriptors: {
      1: "Menyatakan fungsi dan tujuan penyediaan Imbangan Duga.",
      2: "Menerangkan batasan Imbangan Duga dan jenis kesilapan tidak ketara.",
      3: "Menyediakan Imbangan Duga berasaskan baki-baki akaun di dalam lejar.",
      4: "Mengesan dan membetulkan ketidakseimbangan baki dalam Imbangan Duga.",
      5: "Menyediakan Imbangan Duga yang seimbang, kemas dan menepati tempoh perakaunan.",
      6: "Menganalisis ketepatan baki Imbangan Duga secara kritis serta merangka penyelesaian proaktif."
    }
  },
  {
    id: 7,
    code: "MODUL 7.0",
    title: "Penyata Kewangan Milikan Tunggal Tanpa Pelarasan",
    englishTitle: "Financial Statements Without Adjustments",
    descriptors: {
      1: "Menyatakan komponen Akaun Perdagangan, Untung Rugi dan Penyata Kedudukan Kewangan.",
      2: "Menerangkan konsep kos jualan, untung kasar, untung bersih dan modal kerja.",
      3: "Menyediakan Akaun Perdagangan dan Untung Rugi serta PKK dalam bentuk 'T' atau penyata.",
      4: "Menghitung untung bersih dan ekuiti pemilik akhir dengan langkah kerja yang teratur.",
      5: "Menyediakan penyata kewangan lengkap yang menepati Piawaian Pelaporan Kewangan.",
      6: "Menterjemah kedudukan kewangan perniagaan daripada penyata kewangan secara menyeluruh."
    }
  },
  {
    id: 8,
    code: "MODUL 8.0",
    title: "Pelarasan pada Tarikh Imbangan & Penyediaan Penyata Kewangan",
    englishTitle: "Adjustments at Balance Date & Financial Statements",
    descriptors: {
      1: "Menyatakan item pelarasan lazim (belanja/hasil belum bayar & belum terima, susut nilai).",
      2: "Menerangkan konsep perakaunan asas akruan dan pemadanan hasil dengan belanja.",
      3: "Merekod catatan pelarasan dalam Jurnal Am dan memindahkannya ke akaun lejar berkaitan.",
      4: "Menyediakan Imbangan Duga Terselaras dan mengira peruntukan hutang ragu serta susut nilai.",
      5: "Menyediakan Penyata Pendapatan dan Penyata Kedudukan Kewangan dengan pelarasan secara tepat.",
      6: "Menilai impak pelarasan terhadap prestasi keuntungan dan kedudukan kewangan perniagaan."
    }
  },
  {
    id: 9,
    code: "MODUL 9.0",
    title: "Pembetulan Kesilapan",
    englishTitle: "Correction of Errors",
    descriptors: {
      1: "Mengenal pasti kesilapan tidak ketara dan kesilapan ketara dalam imbangan duga.",
      2: "Menerangkan fungsi Akaun Tergantung dalam proses pembetulan kesilapan.",
      3: "Menyediakan catatan jurnal untuk membetulkan kesilapan perakaunan yang dikesan.",
      4: "Menyelaraskan semula lejar, imbangan duga dan menyediakan Penyata Untung Bersih Terkurang/Terlebih.",
      5: "Menyediakan pembetulan kesilapan menyeluruh dengan Akaun Tergantung sehingga baki sifar.",
      6: "Menguasai teknik forensik pengesanan ralat perakaunan dan mencadangkan kawalan dalaman."
    }
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "CHANG POO YEW", ic: "100719-14-0951", gender: "L", modules: [3, 4, 3, 3, 3, 5, 4, 4, 4], overall: 4, attendanceRate: "96%" },
  { id: 2, name: "CHEN YU QIAN", ic: "101005-10-0813", gender: "L", modules: [3, 3, 3, 3, 3, 4, 3, 3, 3], overall: 3, attendanceRate: "92%" },
  { id: 3, name: "CHEONG EXIN", ic: "100310-14-0884", gender: "P", modules: [3, 4, 3, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "98%" },
  { id: 4, name: "CHIN WEE KI", ic: "100510-10-1994", gender: "P", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "99%" },
  { id: 5, name: "DARIUS VOON VANE YITT", ic: "100818-01-1389", gender: "L", modules: [3, 3, 3, 3, 4, 5, 4, 4, 4], overall: 4, attendanceRate: "95%" },
  { id: 6, name: "FOONG HUI XIN", ic: "100112-10-2342", gender: "P", modules: [3, 3, 3, 4, 5, 5, 5, 4, 4], overall: 5, attendanceRate: "97%" },
  { id: 7, name: "KHAW XIN YU", ic: "100712-14-0414", gender: "P", modules: [3, 4, 3, 4, 4, 4, 4, 4, 4], overall: 3, attendanceRate: "93%" },
  { id: 8, name: "KHOO KAI FENG", ic: "101106-10-1145", gender: "L", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "100%" },
  { id: 9, name: "LAU HUI MING", ic: "100509-16-0057", gender: "L", modules: [3, 3, 3, 4, 5, 5, 4, 4, 4], overall: 5, attendanceRate: "96%" },
  { id: 10, name: "LOW YAN FUNG", ic: "100608-10-2741", gender: "L", modules: [3, 3, 3, 4, 4, 5, 3, 3, 3], overall: 4, attendanceRate: "94%" },
  { id: 11, name: "MARCUS TAN CHEE JIE", ic: "100206-14-0665", gender: "L", modules: [3, 4, 3, 4, 4, 5, 4, 4, 4], overall: 4, attendanceRate: "95%" },
  { id: 12, name: "NGEOW KAI YEE", ic: "100611-14-0802", gender: "P", modules: [3, 4, 3, 4, 4, 5, 5, 5, 5], overall: 5, attendanceRate: "98%" },
  { id: 13, name: "RYAN CHAN WEI HAO", ic: "100602-05-0127", gender: "L", modules: [3, 3, 3, 3, 3, 4, 4, 4, 4], overall: 4, attendanceRate: "91%" },
  { id: 14, name: "SOON YI HONG", ic: "100419-10-2283", gender: "L", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "99%" },
  { id: 15, name: "TAN JING HOONG", ic: "101101-10-0055", gender: "L", modules: [3, 3, 3, 3, 3, 4, 3, 3, 3], overall: 3, attendanceRate: "90%" },
  { id: 16, name: "TAN XIN LE", ic: "100928-14-0886", gender: "P", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "99%" },
  { id: 17, name: "THAN KING KAI", ic: "101217-10-0989", gender: "L", modules: [3, 3, 3, 4, 5, 5, 4, 4, 4], overall: 4, attendanceRate: "94%" },
  { id: 18, name: "WONG JUN YAP", ic: "100830-10-1897", gender: "L", modules: [3, 3, 3, 3, 3, 3, 3, 3, 3], overall: 3, attendanceRate: "89%" },
  { id: 19, name: "WONG YI HSIEN", ic: "100415-16-0291", gender: "L", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "98%" },
  { id: 20, name: "WOO WEN XUAN", ic: "100407-10-2809", gender: "L", modules: [3, 3, 3, 4, 4, 5, 4, 4, 4], overall: 4, attendanceRate: "93%" },
  { id: 21, name: "YAP JOVAN", ic: "101008-14-1207", gender: "L", modules: [3, 4, 4, 5, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "97%" },
  { id: 22, name: "YAW YIK THONG", ic: "101008-10-2152", gender: "P", modules: [3, 4, 3, 4, 4, 5, 5, 5, 5], overall: 5, attendanceRate: "97%" },
  { id: 23, name: "YUEN SONG WEI", ic: "100807-14-3693", gender: "L", modules: [3, 4, 3, 4, 5, 5, 5, 5, 5], overall: 5, attendanceRate: "98%" },
  { id: 24, name: "KEITH CHOW MING ZE", ic: "100323-14-0891", gender: "L", modules: ["-", "-", "-", "-", "-", "-", "-", "-", 3], overall: 3, attendanceRate: "78%" }
];

export const TP_RUBRIC_REFERENCE = [
  { tp: 1, title: "Tahu", desc: "Murid tahu perkara asas atau boleh melakukan kemahiran asas atau memberi respons terhadap perkara asas." },
  { tp: 2, title: "Tahu dan Faham", desc: "Murid menunjukkan kefahaman tentang perkara asas dan berkebolehan menjelaskan kefahaman tersebut." },
  { tp: 3, title: "Tahu, Faham dan Boleh Buat", desc: "Murid menggunakan pengetahuan untuk melaksanakan sesuatu kemahiran pada suatu situasi standard." },
  { tp: 4, title: "Tahu, Faham dan Boleh Buat dengan Beradab", desc: "Murid melaksanakan sesuatu kemahiran dengan beradab iaitu mengikut prosedur atau secara sistematik." },
  { tp: 5, title: "Tahu, Faham dan Boleh Buat dengan Beradab Terpuji", desc: "Murid melaksanakan sesuatu kemahiran pada situasi baharu dengan mengikut prosedur secara sistematik serta berhemah dan berintegriti." },
  { tp: 6, title: "Tahu, Faham dan Boleh Buat dengan Beradab Mithali", desc: "Murid berkeupayaan menzahirkan idea kreatif dan inovatif, bertindak secara telus serta boleh dicontohi oleh murid lain." }
];

export function getDefaultTeacherRemark(overallTP: number | string): string {
  const tp = Number(overallTP);
  switch (tp) {
    case 6:
      return "Tahniah! Murid menunjukkan penguasaan yang sangat cemerlang, berdisiplin dan konsisten dalam semua modul perakaunan. Berpotensi tinggi mencapai gred A+ dalam peperiksaan SPM.";
    case 5:
      return "Syabas dan tahniah! Murid mempunyai kefahaman yang sangat kukuh dalam tatacara sistem catatan bergu dan penyediaan penyata kewangan. Teruskan momentum kecemerlangan.";
    case 4:
      return "Pencapaian yang baik dan terpuji. Murid menguasai asas perakaunan dengan sistematik. Tingkatkan ketelitian dalam topik pelarasan dan pembetulan kesilapan untuk ke tahap cemerlang.";
    case 3:
      return "Murid telah mencapai tahap penguasaan minimum. Perlu melipatgandakan latihan kendiri serta memberi lebih tumpuan kepada pemahaman lejar dan persamaan perakaunan.";
    case 2:
      return "Murid masih memerlukan bimbingan guru dan rakan untuk mengukuhkan konsep asas serta tatacara perekodan dokumen ke dalam buku perakaunan.";
    case 1:
      return "Murid memerlukan intervensi dan modul pengukuhan berfokus untuk membina kefahaman asas prinsip perakaunan.";
    default:
      return "Murid menunjukkan komitmen pembelajaran yang positif sepanjang sesi akademik.";
  }
}

export function getTPColor(tp: number | string): { bg: string; text: string; border: string; badge: string } {
  const num = Number(tp);
  switch (num) {
    case 6:
      return { bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" };
    case 5:
      return { bg: "bg-emerald-50", text: "text-emerald-900", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800" };
    case 4:
      return { bg: "bg-sky-50", text: "text-sky-900", border: "border-sky-200", badge: "bg-sky-100 text-sky-800" };
    case 3:
      return { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" };
    case 2:
      return { bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" };
    case 1:
      return { bg: "bg-rose-50", text: "text-rose-900", border: "border-rose-200", badge: "bg-rose-100 text-rose-800" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" };
  }
}

export function calculateAttendanceRate(modules: (number | string)[], overallTP?: number | string): string {
  if (!modules || modules.length === 0) return '95%';

  const total = modules.length || 9;
  const valid = modules.filter((m) => m !== '-' && m !== '' && m !== null && m !== undefined);
  const assessedCount = valid.length;

  if (assessedCount === 0) return '0%';

  const validScores = valid.map((v) => Number(v)).filter((n) => !isNaN(n) && n > 0);
  const sum = validScores.reduce((a, b) => a + b, 0);
  const avg = validScores.length > 0
    ? sum / validScores.length
    : (Number(overallTP) || 3);

  // If some modules are unassessed ('-'), attendance corresponds to participation fraction (e.g. 1/9 assessed -> 78%)
  if (assessedCount < total) {
    const fraction = assessedCount / total;
    const rate = Math.round(75 + fraction * 23);
    return `${Math.min(100, Math.max(10, rate))}%`;
  }

  // All modules assessed: realistic academic attendance rate (89% for TP3 up to 100% for TP5-6)
  let rate = Math.round(89 + ((avg - 3.0) / 2.0) * 11);
  if (avg < 3.0) {
    rate = Math.round(78 + ((avg - 1.0) / 2.0) * 11);
  }

  return `${Math.min(100, Math.max(70, rate))}%`;
}
