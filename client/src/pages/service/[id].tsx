import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, ArrowRight, ChevronRight } from "lucide-react";

interface SubService { title: string; description: string; price: string; }
interface FurnitureFeature { title: string; description: string; }
interface ProcessStep { title: string; description: string; }
interface ServiceCategory {
  id: string; title: string; shortTitle: string;
  description: string; fullDescription: string;
  image: string; coverImage: string;
  benefits: string[];
  processSteps: ProcessStep[];
  subServices: SubService[];
  furnitureFeatures?: FurnitureFeature[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "interior-exterior",
    shortTitle: "Interior & Eksterior",
    title: "Desain Interior & Eksterior",
    description: "Layanan desain komprehensif untuk menciptakan ruang yang fungsional, estetis, dan sesuai dengan kepribadian Anda.",
    fullDescription: "Layanan Desain Interior & Eksterior kami menawarkan solusi komprehensif yang menggabungkan estetika, fungsionalitas, dan inovasi. Tim desainer berpengalaman kami bekerja sama dengan Anda untuk menciptakan ruang yang tidak hanya indah secara visual, tetapi juga mencerminkan gaya hidup, kebutuhan, dan aspirasi Anda — dari konsep awal hingga implementasi akhir.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
    coverImage: "https://images.unsplash.com/photo-1545213673-e2917e1c0e80?w=1800&q=80",
    benefits: [
      "Desain dipersonalisasi sesuai kebutuhan spesifik Anda",
      "Tim desainer profesional berpengalaman lebih dari 10 tahun",
      "Pendekatan kolaboratif sepanjang proses desain",
      "Solusi yang memaksimalkan ruang dan fungsionalitas",
      "Hasil akhir yang memadukan estetika dan kepraktisan",
    ],
    processSteps: [
      { title: "Konsultasi Awal", description: "Pertemuan untuk memahami visi, kebutuhan, dan anggaran Anda serta memberikan gambaran umum layanan kami." },
      { title: "Pengukuran & Analisis Ruang", description: "Kunjungan lokasi untuk mengambil pengukuran tepat dan menganalisis kondisi yang ada." },
      { title: "Pengembangan Konsep", description: "Menciptakan konsep desain awal berdasarkan diskusi dan kebutuhan spesifik Anda." },
      { title: "Presentasi & Revisi", description: "Menyajikan desain melalui rendering 3D dan menyempurnakan berdasarkan umpan balik Anda." },
      { title: "Implementasi", description: "Mengawasi pelaksanaan proyek untuk memastikan desain diimplementasikan dengan tepat dan presisi." },
    ],
    subServices: [
      { title: "Desain Interior Residensial", description: "Transformasi hunian menjadi ruang yang mencerminkan kepribadian dan gaya hidup Anda — dari rumah minimalis modern hingga klasik elegan.", price: "Mulai Rp 15.000.000" },
      { title: "Desain Ruang Komersial", description: "Ciptakan ruang bisnis yang profesional dan merepresentasikan identitas brand Anda — kantor, kafe, retail, hingga hospitality.", price: "Mulai Rp 25.000.000" },
      { title: "Desain Eksterior & Fasad", description: "Tampilan luar bangunan yang memukau dan berkarakter — memadukan estetika arsitektur modern dengan kearifan lokal.", price: "Mulai Rp 12.000.000" },
    ],
  },
  {
    id: "construction",
    shortTitle: "Konstruksi",
    title: "Konstruksi & Renovasi",
    description: "Implementasi proyek yang profesional dengan fokus pada kualitas, efisiensi, dan kepatuhan terhadap standar keamanan.",
    fullDescription: "Layanan Konstruksi & Renovasi kami menawarkan implementasi proyek yang komprehensif dengan standar profesional tertinggi. Dengan tim manajer proyek berpengalaman, kontraktor berkualitas, dan tukang ahli, kami memastikan setiap aspek konstruksi dilaksanakan dengan presisi dan perhatian penuh terhadap detail — tepat waktu, sesuai anggaran.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80",
    coverImage: "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?w=1800&q=80",
    benefits: [
      "Tim konstruksi berpengalaman dan terlatih bersertifikat",
      "Manajemen proyek yang efisien dan tepat waktu",
      "Standar kualitas dan keamanan yang ketat",
      "Transparansi penuh dalam proses dan biaya",
      "Garansi untuk setiap pekerjaan konstruksi",
    ],
    processSteps: [
      { title: "Perencanaan & Perizinan", description: "Mengembangkan rencana proyek terperinci dan mengurus semua persyaratan legal yang dibutuhkan." },
      { title: "Persiapan & Fondasi", description: "Melaksanakan pekerjaan persiapan lahan dan pembangunan fondasi yang kokoh sesuai spesifikasi." },
      { title: "Konstruksi Struktural", description: "Membangun struktur utama sesuai dengan spesifikasi desain dan standar konstruksi nasional." },
      { title: "Instalasi MEP", description: "Memasang sistem mekanikal, elektrikal, dan perpipaan dengan standar kualitas tertinggi." },
      { title: "Finishing & Serah Terima", description: "Melaksanakan pekerjaan finishing hingga detail terkecil, dilanjutkan serah terima dengan garansi." },
    ],
    subServices: [
      { title: "Konstruksi Bangunan Baru", description: "Bangun hunian atau bangunan komersial impian dari nol dengan standar kualitas tertinggi dan manajemen proyek terstruktur.", price: "Mulai Rp 3.500.000/m²" },
      { title: "Renovasi & Restorasi", description: "Hadirkan tampilan baru pada bangunan lama — dari perombakan total, perluasan ruang, hingga restorasi elemen arsitektural.", price: "Mulai Rp 2.000.000/m²" },
      { title: "Manajemen Proyek", description: "Pengawasan penuh dari awal hingga selesai — memastikan proyek berjalan sesuai anggaran, jadwal, dan spesifikasi yang disepakati.", price: "Hubungi Kami" },
    ],
  },
  {
    id: "furniture",
    shortTitle: "Furniture Custom",
    title: "Furniture Custom",
    description: "Desain dan produksi furniture custom yang menggabungkan estetika, fungsionalitas, dan kualitas pengerjaan terbaik.",
    fullDescription: "Layanan Furniture Custom kami menawarkan solusi desain dan produksi yang sepenuhnya dipersonalisasi untuk memenuhi kebutuhan unik Anda. Kami percaya furniture bukan sekadar pengisi ruang, melainkan elemen penting yang menentukan karakter dan kenyamanan. Dari konsep hingga produksi, tim kami bekerja sama dengan Anda untuk menciptakan piece yang unik, fungsional, dan mencerminkan identitas ruang Anda.",
    image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?w=900&q=80",
    coverImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1800&q=80",
    benefits: [
      "Desain furniture unik yang sepenuhnya disesuaikan dengan ruang Anda",
      "Material berkualitas tinggi — kayu solid, plywood premium, finishing terbaik",
      "Pengerjaan presisi dengan keahlian tukang berpengalaman",
      "Furniture ergonomis, fungsional, dan tahan lama",
      "Garansi pengerjaan hingga 2 tahun",
    ],
    processSteps: [
      { title: "Konsultasi & Briefing", description: "Memahami kebutuhan, preferensi, fungsi, dan dimensi furniture yang Anda inginkan." },
      { title: "Konsep & Desain", description: "Mengembangkan konsep dengan gambar teknis, visualisasi 3D, dan contoh material." },
      { title: "Persetujuan & Produksi", description: "Setelah desain disetujui, furniture diproduksi dengan tingkat presisi dan kualitas tertinggi." },
      { title: "Pengiriman & Instalasi", description: "Furniture dikirim dan dipasang di lokasi oleh tim profesional kami dengan penanganan hati-hati." },
    ],
    subServices: [],
    furnitureFeatures: [
      { title: "Desain Eksklusif Sesuai Ruang", description: "Setiap furniture dirancang khusus berdasarkan dimensi, karakter, dan kebutuhan spesifik ruang Anda — tidak ada yang serupa di tempat lain." },
      { title: "Material Premium Bersertifikat", description: "Kami menggunakan kayu jati solid, plywood premium, HPL doff, dan material pilihan lain yang teruji kualitas dan ketahanannya." },
      { title: "Garansi Pengerjaan 2 Tahun", description: "Setiap produk furniture custom kami dilengkapi garansi pengerjaan 2 tahun — jaminan nyata atas komitmen kualitas kami." },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }),
};
const slideLeft = { hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const slideRight = { hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

function ServiceHero({ category }: { category: ServiceCategory }) {
  return (
    <section className="relative h-[72vh] overflow-hidden bg-[#111]">
      <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "linear" }}>
        <img src={category.coverImage} alt={category.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>
      <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center gap-2 mb-6">
          <Link href="/"><span className="text-white/40 text-xs tracking-widest uppercase hover:text-[#FFD700] transition-colors cursor-pointer">Beranda</span></Link>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <Link href="/services"><span className="text-white/40 text-xs tracking-widest uppercase hover:text-[#FFD700] transition-colors cursor-pointer">Layanan</span></Link>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <span className="text-[#FFD700] text-xs tracking-widest uppercase">{category.shortTitle}</span>
        </motion.div>
        <motion.div className="w-12 h-px bg-[#FFD700] mb-6" initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.5 }} />
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-white mb-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, lineHeight: 1.1 }}>
          {category.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.6 }} className="text-white/55 text-sm leading-relaxed max-w-lg mb-8">
          {category.description}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 bg-[#FFD700] text-[#111] text-sm font-semibold px-7 py-3 hover:bg-[#FFD700]/90 transition-colors">
              Konsultasi Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 right-12 z-10 hidden md:flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div className="w-px h-8 bg-white/30 origin-top" animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </section>
  );
}

function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="py-28 bg-[#111]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
          <p className="text-[#FFD700] text-xs tracking-widest uppercase mb-3">Alur Kerja</p>
          <h2 className="text-white" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, lineHeight: 1.1 }}>Proses Pengerjaan</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="relative border-t border-white/10 pt-8 pb-10 pr-8 group">
              <div className="absolute top-6 right-4 select-none pointer-events-none" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "5rem", fontWeight: 300, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-0 group-hover:w-8 h-px bg-[#FFD700] mb-5 transition-all duration-500" />
              <p className="text-[#FFD700] text-xs tracking-widest mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-white mb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "1.4rem", fontWeight: 400 }}>{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubServicesSection({ subServices, bg }: { subServices: SubService[]; bg: string }) {
  return (
    <section className={`py-28 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
          <p className="text-[#B8860B] text-xs tracking-widest uppercase mb-3">Cakupan</p>
          <h2 className="text-[#111]" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.1 }}>Apa yang Kami Kerjakan</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {subServices.map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="border-t border-[#111]/10 pt-8 pb-10 pr-8 group cursor-default">
              <div className="w-0 group-hover:w-10 h-px bg-[#FFD700] mb-5 transition-all duration-500" />
              <p className="text-[#B8860B] text-xs tracking-widest mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-[#111] mb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "1.5rem", fontWeight: 400 }}>{s.title}</h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">{s.description}</p>
              <span className="text-[#B8860B] text-xs font-medium tracking-wide">{s.price}</span>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 pt-10 border-t border-[#111]/10">
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 border border-[#111] text-[#111] text-sm font-medium px-8 py-3 hover:bg-[#111] hover:text-white transition-colors">
              Dapatkan Penawaran <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection({ categoryTitle }: { categoryTitle: string }) {
  return (
    <section className="py-24 bg-[#111]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="w-10 h-px bg-[#FFD700] mb-6" />
            <h2 className="text-white mb-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>
              Siap Mewujudkan<br />Ruang Impian Anda?
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">Konsultasikan kebutuhan {categoryTitle.toLowerCase()} Anda dengan tim profesional kami. Kami siap memberikan solusi terbaik sesuai kebutuhan dan anggaran Anda.</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Link href="/contact">
              <button className="inline-flex items-center justify-center gap-2 bg-[#FFD700] text-[#111] text-sm font-semibold px-8 py-4 hover:bg-[#FFD700]/90 transition-colors w-full sm:w-auto">
                Konsultasi Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/services">
              <button className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-sm font-medium px-8 py-4 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors w-full sm:w-auto">
                Lihat Layanan Lain
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TentangLayanan({ category, bg, reverse = false }: { category: ServiceCategory; bg: string; reverse?: boolean }) {
  return (
    <section className={`py-28 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <motion.div variants={reverse ? slideRight : slideLeft} initial="hidden" whileInView="show" viewport={{ once: true }} className={`relative ${reverse ? "[direction:ltr]" : ""}`}>
            <div className={`absolute -top-4 ${reverse ? "-right-4" : "-left-4"} w-20 h-20 border border-[#FFD700]/30`} />
            <img src={category.image} alt={category.title} className="w-full aspect-[4/5] object-cover" />
            <div className={`absolute -bottom-4 ${reverse ? "-left-4" : "-right-4"} w-28 h-28 ${bg === "bg-[#F2EFE9]" ? "bg-[#FAF8F5]" : "bg-[#F2EFE9]"}`} />
          </motion.div>
          <motion.div variants={reverse ? slideLeft : slideRight} initial="hidden" whileInView="show" viewport={{ once: true }} className={reverse ? "[direction:ltr]" : ""}>
            <p className="text-[#B8860B] text-xs tracking-widest uppercase mb-4">Tentang Layanan</p>
            <h2 className="text-[#111] mb-6" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.15 }}>
              {category.title}
            </h2>
            <div className="w-10 h-px bg-[#FFD700] mb-6" />
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-8">{category.fullDescription}</p>
            <div className="space-y-3 mb-8">
              {category.benefits.map((b, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#111]" />
                  </div>
                  <span className="text-[#4A4A4A] text-sm">{b}</span>
                </motion.div>
              ))}
            </div>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 bg-[#111] text-white text-sm font-medium px-7 py-3 hover:bg-[#333] transition-colors">
                Mulai Konsultasi <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FurniturePage({ category }: { category: ServiceCategory }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main>
        <ServiceHero category={category} />
        {/* Tentang — Pearl, foto kiri */}
        <section className="py-28 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={slideLeft} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 border border-[#FFD700]/30" />
                <img src={category.image} alt={category.title} className="w-full aspect-[4/5] object-cover" />
                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#F2EFE9]" />
              </motion.div>
              <motion.div variants={slideRight} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <p className="text-[#B8860B] text-xs tracking-widest uppercase mb-4">Tentang Layanan</p>
                <h2 className="text-[#111] mb-6" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.15 }}>{category.title}</h2>
                <div className="w-10 h-px bg-[#FFD700] mb-6" />
                <p className="text-[#4A4A4A] text-sm leading-relaxed mb-8">{category.fullDescription}</p>
                <div className="space-y-3 mb-8">
                  {category.benefits.map((b, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-[#111]" /></div>
                      <span className="text-[#4A4A4A] text-sm">{b}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact"><button className="inline-flex items-center gap-2 bg-[#111] text-white text-sm font-medium px-7 py-3 hover:bg-[#333] transition-colors">Konsultasi Furniture <ArrowRight className="w-4 h-4" /></button></Link>
                  <Link href="/products"><button className="inline-flex items-center gap-2 border border-[#111] text-[#111] text-sm font-medium px-7 py-3 hover:bg-[#111] hover:text-white transition-colors">Lihat Koleksi Produk</button></Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <ProcessSection steps={category.processSteps} />
        {/* Mengapa Custom? — Linen */}
        <section className="py-28 bg-[#F2EFE9]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
              <p className="text-[#B8860B] text-xs tracking-widest uppercase mb-3">Keunggulan</p>
              <h2 className="text-[#111]" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.1 }}>Mengapa Furniture Custom?</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {(category.furnitureFeatures ?? []).map((f, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="border-t border-[#111]/10 pt-8 pb-10 pr-8 group cursor-default">
                  <div className="w-0 group-hover:w-10 h-px bg-[#FFD700] mb-5 transition-all duration-500" />
                  <p className="text-[#B8860B] text-xs tracking-widest mb-3">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-[#111] mb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "1.5rem", fontWeight: 400 }}>{f.title}</h3>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 pt-10 border-t border-[#111]/10 flex flex-wrap gap-4 items-center justify-between">
              <p className="text-[#4A4A4A] text-sm max-w-lg">Lihat koleksi lengkap produk furniture kami — dari meja, sofa, lemari, hingga kitchen set custom.</p>
              <Link href="/products"><button className="inline-flex items-center gap-2 bg-[#111] text-white text-sm font-semibold px-8 py-4 hover:bg-[#333] transition-colors">Lihat Koleksi Produk <ArrowRight className="w-4 h-4" /></button></Link>
            </motion.div>
          </div>
        </section>
        {/* CTA furniture */}
        <section className="py-24 bg-[#111]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className="w-10 h-px bg-[#FFD700] mb-6" />
                <h2 className="text-white mb-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>Wujudkan Furniture<br />Impian Anda Bersama Kami.</h2>
                <p className="text-white/40 text-sm leading-relaxed">Dari meja kerja minimalis hingga kitchen set penuh — kami rancang dan produksi sesuai kebutuhan spesifik Anda.</p>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link href="/contact"><button className="inline-flex items-center justify-center gap-2 bg-[#FFD700] text-[#111] text-sm font-semibold px-8 py-4 hover:bg-[#FFD700]/90 transition-colors w-full sm:w-auto">Konsultasi Sekarang <ArrowRight className="w-4 h-4" /></button></Link>
                <Link href="/products"><button className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-sm font-medium px-8 py-4 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors w-full sm:w-auto">Lihat Koleksi Produk</button></Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="flex items-center justify-center min-h-[60vh] px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-md">
          <div className="w-10 h-px bg-[#FFD700] mx-auto mb-8" />
          <h1 className="text-[#111] mb-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "2.5rem", fontWeight: 400 }}>Layanan Tidak Ditemukan</h1>
          <p className="text-[#4A4A4A] text-sm mb-8 leading-relaxed">Maaf, layanan yang Anda cari tidak tersedia.</p>
          <Link href="/services"><button className="inline-flex items-center gap-2 bg-[#111] text-white text-sm font-medium px-7 py-3 hover:bg-[#333] transition-colors"><ArrowLeft className="w-4 h-4" />Kembali ke Layanan</button></Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = serviceCategories.find((c) => c.id === categoryId);

  if (!category) return <NotFoundPage />;

  if (category.id === "furniture") return <FurniturePage category={category} />;

  // Interior & Construction — shared layout, different bg & photo side
  const isConstruction = category.id === "construction";
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main>
        <ServiceHero category={category} />
        <TentangLayanan category={category} bg={isConstruction ? "bg-[#F2EFE9]" : "bg-[#FAF8F5]"} reverse={isConstruction} />
        <ProcessSection steps={category.processSteps} />
        <SubServicesSection subServices={category.subServices} bg={isConstruction ? "bg-[#FAF8F5]" : "bg-[#F2EFE9]"} />
        <CTASection categoryTitle={category.title} />
      </main>
      <Footer />
    </div>
  );
}
