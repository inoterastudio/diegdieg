import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Handshake, AlertTriangle, CreditCard, RefreshCw, Scale, ArrowRight } from "lucide-react";

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };
const FONT = "'Roboto', Arial, sans-serif";

const HERO_IMG = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,   transition: { duration: 0.65, ease: "easeOut" } },
};

const sections = [
  {
    num: "01",
    icon: FileText,
    title: "Penerimaan Syarat",
    content: [
      "Dengan mengakses dan menggunakan website DIEGMA (diegma.com), Anda menyetujui untuk terikat oleh Syarat & Ketentuan yang tercantum di halaman ini. Jika Anda tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami.",
      "Syarat & Ketentuan ini berlaku untuk semua pengunjung, pengguna, dan pihak lain yang mengakses atau menggunakan layanan kami, baik secara langsung maupun melalui pihak ketiga.",
    ],
  },
  {
    num: "02",
    icon: Handshake,
    title: "Layanan yang Kami Berikan",
    content: [
      "DIEGMA menyediakan layanan konsultasi, desain interior & eksterior, konstruksi, dan furniture custom. Lingkup setiap proyek akan disepakati secara tertulis melalui perjanjian kerja atau proposal resmi sebelum pekerjaan dimulai.",
      "Kami berhak untuk menolak, membatalkan, atau menghentikan layanan kepada siapa pun karena alasan apa pun, sesuai dengan kebijakan internal dan standar profesional yang kami terapkan.",
    ],
  },
  {
    num: "03",
    icon: CreditCard,
    title: "Pembayaran & Harga",
    content: [
      "Harga layanan bersifat custom sesuai dengan kompleksitas proyek dan disepakati sebelum pekerjaan dimulai. Semua harga yang tertera dalam proposal resmi sudah termasuk pajak yang berlaku kecuali dinyatakan sebaliknya.",
      "Jadwal pembayaran (termin) akan diatur dalam perjanjian proyek. Keterlambatan pembayaran dapat mengakibatkan penundaan jadwal pengerjaan. Uang muka yang telah dibayarkan bersifat non-refundable kecuali terjadi pembatalan dari pihak DIEGMA.",
    ],
  },
  {
    num: "04",
    icon: Scale,
    title: "Hak Kekayaan Intelektual",
    content: [
      "Seluruh konten yang terdapat di website ini — termasuk desain, gambar, teks, logo, dan karya visual lainnya — adalah milik DIEGMA dan dilindungi oleh hukum hak cipta yang berlaku di Indonesia.",
      "Konsep desain, gambar teknis, dan materi visual yang dihasilkan dari proyek klien menjadi hak milik klien setelah seluruh pembayaran diselesaikan. Namun, DIEGMA berhak menggunakan dokumentasi visual proyek untuk keperluan portofolio dan promosi kecuali ada kesepakatan khusus.",
    ],
  },
  {
    num: "05",
    icon: AlertTriangle,
    title: "Batasan Tanggung Jawab",
    content: [
      "DIEGMA tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami, termasuk namun tidak terbatas pada kerugian keuntungan, data, atau reputasi.",
      "Tanggung jawab maksimal DIEGMA dalam hal apapun tidak akan melebihi nilai total pembayaran yang diterima dari klien dalam proyek yang bersangkutan.",
    ],
  },
  {
    num: "06",
    icon: RefreshCw,
    title: "Perubahan Syarat & Penyelesaian Sengketa",
    content: [
      "Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan layanan kami setelah perubahan diterbitkan berarti Anda menyetujui syarat yang telah diperbarui.",
      "Setiap sengketa yang timbul sehubungan dengan layanan kami akan diselesaikan terlebih dahulu melalui musyawarah. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan sesuai dengan hukum yang berlaku di Indonesia, dengan yurisdiksi di Bandung, Jawa Barat.",
    ],
  },
];

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* ═══ HERO ═══ */}
        <section className="relative w-full overflow-hidden" style={{ height: "52vh", minHeight: "420px" }}>
          <motion.img
            src={HERO_IMG}
            alt="Syarat & Ketentuan DIEGMA"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 55%,rgba(0,0,0,0.18) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.5) 0%,transparent 70%)" }} />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-6 lg:px-16 pb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4"
                  style={{ color: C.gold, fontFamily: FONT }}
                >
                  Legal — Ketentuan
                </p>
                <h1
                  className="text-white font-bold leading-tight mb-4"
                  style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", fontFamily: FONT }}
                >
                  Syarat & Ketentuan
                </h1>
                <p className="text-white/55 text-sm leading-relaxed max-w-lg" style={{ fontFamily: FONT }}>
                  Dengan menggunakan layanan DIEGMA, Anda menyetujui ketentuan berikut.
                  Harap baca dengan seksama sebelum menggunakan layanan kami.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="absolute top-24 left-0 right-0">
            <div className="container mx-auto px-6 lg:px-16">
              <motion.div
                className="flex items-center gap-2 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: FONT }}
              >
                <Link href="/">
                  <span className="hover:text-white transition-colors cursor-pointer">Beranda</span>
                </Link>
                <ArrowRight size={11} />
                <span style={{ color: C.gold }}>Syarat & Ketentuan</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ INTRO BANNER ═══ */}
        <section style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16 py-10">
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                style={{ border: `1px solid ${C.gold}`, color: C.gold }}
              >
                <Scale size={22} />
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1" style={{ fontFamily: FONT }}>
                  Perjanjian antara Anda dan DIEGMA
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: FONT }}>
                  Dokumen ini mengatur hubungan hukum antara Anda sebagai pengguna dan DIEGMA sebagai
                  penyedia layanan desain dan konstruksi. Kami menjamin transparansi di setiap prosesnya.
                </p>
              </div>
              <div className="md:ml-auto flex-shrink-0 text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: FONT }}>
                Terakhir diperbarui:<br />
                <span style={{ color: C.gold }}>April 2025</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CONTENT SECTIONS ═══ */}
        <section style={{ backgroundColor: C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16 py-20 lg:py-28">
            <div className="max-w-4xl mx-auto">
              {sections.map((sec, i) => {
                const Icon = sec.icon;
                const isEven = i % 2 === 1;
                return (
                  <motion.div
                    key={sec.num}
                    className="mb-16 lg:mb-20"
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
                  >
                    {i > 0 && (
                      <div className="mb-16" style={{ height: "0.5px", backgroundColor: "#E5E0D8" }} />
                    )}

                    <div className={`flex flex-col lg:flex-row gap-10 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                      {/* Number + Icon */}
                      <div className="flex-shrink-0 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-3 lg:w-36">
                        <span
                          className="font-bold leading-none select-none"
                          style={{ fontSize: "56px", color: `${C.gold}1A`, fontFamily: FONT }}
                        >
                          {sec.num}
                        </span>
                        <div
                          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: C.dark, color: C.gold }}
                        >
                          <Icon size={16} />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h2
                          className="font-bold mb-5"
                          style={{ fontSize: "clamp(1.2rem,2.2vw,1.55rem)", color: C.text, fontFamily: FONT }}
                        >
                          {sec.title}
                        </h2>
                        <div className="space-y-4">
                          {sec.content.map((para, pi) => (
                            <p
                              key={pi}
                              className="leading-relaxed"
                              style={{ fontSize: "15px", color: "#666", fontFamily: FONT }}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ LINEN ACCENT STRIP ═══ */}
        <section style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16 py-10">
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div>
                <p className="font-medium mb-1" style={{ color: C.text, fontFamily: FONT, fontSize: "15px" }}>
                  Pertanyaan tentang ketentuan ini?
                </p>
                <p style={{ color: "#888", fontFamily: FONT, fontSize: "13px" }}>
                  Tim legal kami siap memberikan klarifikasi lebih lanjut.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/kebijakan-privasi">
                  <button
                    className="px-5 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-80"
                    style={{ border: `1px solid ${C.text}`, color: C.text, fontFamily: FONT, letterSpacing: "0.1em", backgroundColor: "transparent" }}
                  >
                    Kebijakan Privasi
                  </button>
                </Link>
                <Link href="/contact">
                  <button
                    className="flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: C.dark, color: C.pearl, fontFamily: FONT, letterSpacing: "0.1em" }}
                  >
                    Hubungi Kami
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
