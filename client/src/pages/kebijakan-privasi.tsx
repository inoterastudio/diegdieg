import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, Eye, Lock, Database, UserCheck, Mail, ArrowRight } from "lucide-react";

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };
const FONT = "'Roboto', Arial, sans-serif";

const HERO_IMG = "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1800&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,   transition: { duration: 0.65, ease: "easeOut" } },
};

const sections = [
  {
    num: "01",
    icon: Database,
    title: "Informasi yang Kami Kumpulkan",
    content: [
      "Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk namun tidak terbatas pada: nama lengkap, alamat email, nomor telepon, dan detail proyek yang Anda sampaikan melalui formulir kontak.",
      "Selain itu, kami dapat mengumpulkan informasi teknis secara otomatis saat Anda mengunjungi website kami, seperti alamat IP, jenis browser, halaman yang dikunjungi, dan waktu kunjungan untuk keperluan analitik.",
    ],
  },
  {
    num: "02",
    icon: Eye,
    title: "Bagaimana Kami Menggunakan Informasi",
    content: [
      "Informasi yang kami kumpulkan digunakan untuk merespons pertanyaan dan permintaan konsultasi Anda, mengirimkan pembaruan mengenai layanan dan portofolio terbaru kami (hanya jika Anda berlangganan newsletter), serta meningkatkan kualitas layanan dan pengalaman pengguna di website kami.",
      "Kami tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan eksplisit Anda, kecuali diwajibkan oleh hukum.",
    ],
  },
  {
    num: "03",
    icon: Lock,
    title: "Keamanan Data",
    content: [
      "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghapusan yang tidak disengaja.",
      "Data Anda disimpan menggunakan layanan cloud terenkripsi. Meskipun demikian, tidak ada metode transmisi internet yang 100% aman. Kami berkomitmen untuk selalu meningkatkan standar perlindungan data kami.",
    ],
  },
  {
    num: "04",
    icon: UserCheck,
    title: "Hak-Hak Anda",
    content: [
      "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi yang kami miliki tentang Anda kapan saja. Anda juga dapat berhenti berlangganan newsletter kami melalui tautan yang tersedia di setiap email.",
      "Untuk mengajukan permintaan terkait data pribadi Anda, silakan hubungi kami melalui halaman kontak atau langsung via email yang tertera di bawah ini.",
    ],
  },
  {
    num: "05",
    icon: Shield,
    title: "Cookie & Teknologi Pelacakan",
    content: [
      "Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan menganalisis trafik. Anda dapat mengatur browser Anda untuk menolak cookie, namun hal ini mungkin memengaruhi beberapa fungsi website.",
      "Kami menggunakan Google Analytics untuk memahami bagaimana pengunjung berinteraksi dengan website kami. Data ini dikumpulkan secara anonim dan tidak dapat digunakan untuk mengidentifikasi Anda secara pribadi.",
    ],
  },
  {
    num: "06",
    icon: Mail,
    title: "Kontak & Pembaruan Kebijakan",
    content: [
      "Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Perubahan signifikan akan kami beritahukan melalui email atau pemberitahuan di website. Tanggal pembaruan terakhir tercantum di bagian bawah halaman ini.",
      "Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan ini, jangan ragu untuk menghubungi kami di info@diegma.com atau melalui formulir kontak di halaman Kontak.",
    ],
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* ═══ HERO ═══ */}
        <section className="relative w-full overflow-hidden" style={{ height: "52vh", minHeight: "420px" }}>
          <motion.img
            src={HERO_IMG}
            alt="Kebijakan Privasi DIEGMA"
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
                  Legal — Privasi
                </p>
                <h1
                  className="text-white font-bold leading-tight mb-4"
                  style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", fontFamily: FONT }}
                >
                  Kebijakan Privasi
                </h1>
                <p className="text-white/55 text-sm leading-relaxed max-w-lg" style={{ fontFamily: FONT }}>
                  Kami menghargai privasi Anda. Pelajari bagaimana kami mengumpulkan,
                  menggunakan, dan melindungi informasi pribadi Anda.
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
                <span style={{ color: C.gold }}>Kebijakan Privasi</span>
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
                <Shield size={22} />
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1" style={{ fontFamily: FONT }}>
                  Komitmen Kami terhadap Privasi Anda
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: FONT }}>
                  DIEGMA berkomitmen menjaga kerahasiaan data Anda. Kebijakan ini berlaku untuk semua layanan
                  yang kami tawarkan dan mencerminkan standar etika tertinggi yang kami pegang.
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
                    {/* Separator line */}
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

        {/* ═══ CTA BOTTOM ═══ */}
        <section style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16 py-16 lg:py-20">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3"
                style={{ color: C.gold, fontFamily: FONT }}
              >
                Ada pertanyaan?
              </p>
              <h3
                className="font-bold mb-4 leading-tight"
                style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: C.text, fontFamily: FONT }}
              >
                Hubungi Kami
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#777", fontFamily: FONT }}>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin mengelola data
                pribadi Anda, tim kami siap membantu.
              </p>
              <Link href="/contact">
                <button
                  className="flex items-center gap-3 px-8 py-3.5 text-sm font-medium tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: C.dark,
                    color: C.pearl,
                    fontFamily: FONT,
                    letterSpacing: "0.1em",
                  }}
                >
                  Halaman Kontak
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
