import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowRight, ImageIcon, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";

interface LayananItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  startPrice: string;
}

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };
const WA_NUMBER = "6281239243317";
const WA_MSG_GENERAL = encodeURIComponent("Halo DIEGMA, saya ingin konsultasi mengenai layanan Anda.");
const HERO_IMG_DEFAULT = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80";

const CATEGORY_CONFIG = [
  {
    key: "interior-eksterior",
    num: "01",
    title: "Desain Interior\n& Eksterior",
    titleFlat: "Desain Interior & Eksterior",
    description: "Layanan desain komprehensif untuk menciptakan ruang yang fungsional, estetis, dan sesuai dengan kebutuhan Anda — dari konsep awal hingga finishing akhir.",
    defaultImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
    benefits: [
      "Desain disesuaikan dengan kepribadian dan gaya hidup Anda",
      "Pendekatan holistik yang memadukan estetika dan fungsi",
      "Material berkualitas tinggi dengan perhatian pada setiap detail",
      "Proses kolaboratif yang melibatkan Anda di setiap tahapan",
    ],
    bg: "#FAF8F5",
    dark: false,
    reverse: false,
  },
  {
    key: "konstruksi",
    num: "02",
    title: "Konstruksi\n& Renovasi",
    titleFlat: "Konstruksi & Renovasi",
    description: "Implementasi proyek yang profesional dengan fokus pada kualitas, efisiensi, dan kepatuhan terhadap standar keamanan — dari pondasi hingga finishing.",
    defaultImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80",
    benefits: [
      "Manajemen proyek efisien dan selalu tepat waktu",
      "Tim berpengalaman dengan keahlian teknis tinggi",
      "Kepatuhan penuh terhadap standar keamanan dan kualitas",
      "Komunikasi transparan selama seluruh proses konstruksi",
    ],
    bg: "#111111",
    dark: true,
    reverse: true,
  },
  {
    key: "furniture",
    num: "03",
    title: "Furniture\nCustom",
    titleFlat: "Furniture Custom",
    description: "Furniture eksklusif yang dirancang dan diproduksi khusus untuk ruang Anda — memadukan material pilihan, estetika premium, dan fungsi terbaik.",
    defaultImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    benefits: [
      "Desain furniture disesuaikan dengan ruang dan kebutuhan spesifik",
      "Material berkualitas tinggi dan tahan lama pilihan terbaik",
      "Craftsmanship dengan perhatian mendalam pada setiap detail",
      "Sentuhan estetika yang memperindah sekaligus fungsional",
    ],
    bg: "#F2EFE9",
    dark: false,
    reverse: false,
  },
];

const KEUNGGULAN = [
  { num: "01", title: "Kualitas Premium", desc: "Standar tertinggi diterapkan di setiap aspek — dari material, pengerjaan, hingga hasil akhir proyek Anda." },
  { num: "02", title: "Tepat Waktu", desc: "Komitmen kami terhadap jadwal adalah bagian dari rasa hormat kepada kepercayaan yang Anda berikan." },
  { num: "03", title: "Hasil Terjamin", desc: "Kepuasan Anda adalah prioritas utama. Kami memastikan setiap hasil sesuai ekspektasi yang ditetapkan sejak awal." },
  { num: "04", title: "Inovasi", desc: "Solusi desain terkini yang relevan, unik, dan bermakna — selalu kami hadirkan di setiap proyek." },
];

export default function ServicesPage() {
  const [services, setServices] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [catImages, setCatImages] = useState<Record<string, string>>({});
  const [heroImage, setHeroImage] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [q_snap, img_snap, pages_snap] = await Promise.all([
          getDocs(query(collection(db, "layanan"), orderBy("createdAt", "desc"))),
          getDoc(doc(db, "settings", "layanan-images")),
          getDoc(doc(db, "settings", "pages")),
        ]);
        setServices(q_snap.docs.map(d => ({ id: d.id, ...d.data() } as LayananItem)));
        if (img_snap.exists()) setCatImages(img_snap.data() as Record<string, string>);
        if (pages_snap.exists() && pages_snap.data().layananHeroImage) setHeroImage(pages_snap.data().layananHeroImage);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const getByCategory = (key: string) => services.filter(s => s.category === key);

  const scrollToSection = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* 1. HERO */}
        <section className="relative w-full overflow-hidden" style={{ height: "72vh", minHeight: "560px" }}>
          <motion.img
            src={heroImage || HERO_IMG_DEFAULT}
            alt="DIEGMA Layanan Hero"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.90) 0%,rgba(0,0,0,0.40) 55%,rgba(0,0,0,0.15) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.45) 0%,transparent 65%)" }} />

          {/* Badge */}
          <motion.div
            className="absolute top-24 right-6 sm:right-10 lg:right-16"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="border border-white/20 px-4 py-2 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 font-medium" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Premium Design Studio</p>
            </div>
          </motion.div>

          {/* Teks */}
          <motion.div
            className="absolute left-0 px-6 sm:px-10 lg:px-16"
            style={{ bottom: "12vh", maxWidth: "700px" }}
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Layanan DIEGMA
              </p>
            </div>
            <h1 className="font-bold text-white leading-tight mb-5 drop-shadow-lg"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontFamily: "'Roboto', Arial, sans-serif" }}>
              Layanan yang Membentuk<br />Ruang Luar Biasa.
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-md" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
              Dari desain interior hingga konstruksi dan furniture custom — solusi lengkap untuk setiap kebutuhan ruang Anda.
            </p>
          </motion.div>

          {/* Anchor pills */}
          <motion.div
            className="absolute bottom-6 right-6 sm:right-10 lg:right-16 hidden sm:flex gap-2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {CATEGORY_CONFIG.map(cat => (
              <button
                key={cat.key}
                onClick={() => scrollToSection(cat.key)}
                className="text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1.5 border border-white/20 text-white/60 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(0,0,0,0.3)", fontFamily: "'Roboto', Arial, sans-serif" }}
              >
                {cat.num}
              </button>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Scroll</span>
            <motion.div
              className="w-px bg-white/30" style={{ height: "36px" }}
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        {/* 2. KEUNGGULAN */}
        <section className="py-20" style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="mb-14"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Mengapa DIEGMA
              </p>
              <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
              <h2 className="font-bold leading-tight"
                style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Komitmen Kami pada<br />Setiap Proyek.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KEUNGGULAN.map((k, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8"
                  style={{ backgroundColor: C.pearl, border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 h-[3px]"
                    style={{ backgroundColor: C.gold, width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="block font-bold leading-none mb-5 select-none"
                    style={{ fontSize: "52px", color: "rgba(255,215,0,0.22)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1 }}>
                    {k.num}
                  </span>
                  <h3 className="font-semibold mb-3 transition-colors duration-300 group-hover:text-yellow-600"
                    style={{ fontSize: "15px", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>
                    {k.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                    {k.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CATEGORY SECTIONS */}
        {loading ? (
          <div className="flex items-center justify-center py-32" style={{ backgroundColor: C.pearl }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.gold }} />
          </div>
        ) : (
          CATEGORY_CONFIG.map((cat) => {
            const items = getByCategory(cat.key);
            const heroImg = catImages[cat.key] || items[0]?.image || cat.defaultImage;
            const isDark = cat.dark;
            const isReversed = cat.reverse;

            return (
              <section
                key={cat.key}
                ref={(el: HTMLElement | null) => { sectionRefs.current[cat.key] = el; }}
                className="py-24 scroll-mt-20"
                style={{ backgroundColor: cat.bg }}
              >
                <div className="container mx-auto px-6 lg:px-16">

                  {/* 2-col header */}
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 ${isReversed ? "lg:grid-flow-dense" : ""}`}>

                    {/* Teks */}
                    <motion.div
                      initial={{ opacity: 0, x: isReversed ? 32 : -32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.75 }}
                      className={`max-w-xl ${isReversed ? "lg:col-start-2" : ""}`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3"
                        style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                        Layanan {cat.num}
                      </p>
                      <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
                      <h2 className="font-bold leading-tight mb-7"
                        style={{ fontSize: "clamp(1.9rem,3vw,2.8rem)", color: isDark ? "#fff" : C.text, fontFamily: "'Roboto', Arial, sans-serif", whiteSpace: "pre-line" }}>
                        {cat.title}
                      </h2>
                      <p className="text-base leading-relaxed mb-8"
                        style={{ color: isDark ? "rgba(255,255,255,0.50)" : "#666", fontFamily: "'Roboto', Arial, sans-serif" }}>
                        {cat.description}
                      </p>

                      <ul className="space-y-3 mb-10">
                        {cat.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.gold }} />
                            </div>
                            <span className="text-sm leading-relaxed"
                              style={{ color: isDark ? "rgba(255,255,255,0.55)" : "#555", fontFamily: "'Roboto', Arial, sans-serif" }}>
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo DIEGMA, saya tertarik dengan layanan *${cat.titleFlat}*. Boleh info lebih lanjut?`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <motion.button
                          whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }}
                          whileTap={{ scale: 0.97 }}
                          className="border text-sm font-semibold px-7 py-3 transition-all duration-300 flex items-center gap-2"
                          style={{
                            borderRadius: 0,
                            borderColor: isDark ? "rgba(255,255,255,0.25)" : C.text,
                            color: isDark ? "rgba(255,255,255,0.75)" : C.text,
                            fontFamily: "'Roboto', Arial, sans-serif",
                          }}
                        >
                          Konsultasi Sekarang <ArrowRight size={14} />
                        </motion.button>
                      </a>
                    </motion.div>

                    {/* Foto */}
                    <motion.div
                      initial={{ opacity: 0, x: isReversed ? -32 : 32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.75, delay: 0.15 }}
                      className={`relative ${isReversed ? "lg:col-start-1 lg:row-start-1" : ""}`}
                    >
                      <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
                        <img
                          src={heroImg}
                          alt={cat.titleFlat}
                          className="w-full h-full object-cover"
                          onError={e => { (e.currentTarget as HTMLImageElement).src = cat.defaultImage; }}
                        />
                      </div>
                      <div className="absolute -bottom-5 -left-5"
                        style={{ zIndex: -1, backgroundColor: C.gold, width: "80px", height: "80px" }} />
                      <div className="absolute top-6 right-6 font-bold select-none pointer-events-none"
                        style={{ fontSize: "80px", lineHeight: 1, color: isDark ? "rgba(255,215,0,0.10)" : "rgba(255,215,0,0.18)", fontFamily: "'Roboto', Arial, sans-serif" }}>
                        {cat.num}
                      </div>
                    </motion.div>
                  </div>

                  {/* Sub-layanan cards */}
                  {items.length > 0 && (
                    <div>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-8"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-px w-6" style={{ backgroundColor: C.gold }} />
                          <h3 className="font-semibold text-sm uppercase tracking-widest"
                            style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                            Sub Layanan
                          </h3>
                        </div>
                        <span className="text-xs"
                          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#aaa", fontFamily: "'Roboto', Arial, sans-serif" }}>
                          {items.length} tersedia
                        </span>
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                            className="group relative overflow-hidden"
                            style={{
                              backgroundColor: isDark ? "#1a1a1a" : C.pearl,
                              border: isDark ? "1px solid rgba(255,215,0,0.10)" : "1px solid rgba(0,0,0,0.07)",
                            }}
                          >
                            <motion.div
                              className="absolute bottom-0 left-0 h-[3px] z-10"
                              style={{ backgroundColor: C.gold, width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.35 }}
                            />
                            <div className="overflow-hidden" style={{ height: "160px" }}>
                              {item.image ? (
                                <img src={item.image} alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                  style={{ backgroundColor: isDark ? "#222" : "#e8e4dc" }}>
                                  <ImageIcon className="w-8 h-8" style={{ color: isDark ? "#444" : "#bbb" }} />
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h4 className="font-semibold mb-2 line-clamp-2 leading-snug"
                                style={{ fontSize: "14px", color: isDark ? "#fff" : C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-xs leading-relaxed mb-3 line-clamp-2"
                                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#999", fontFamily: "'Roboto', Arial, sans-serif" }}>
                                  {item.description}
                                </p>
                              )}
                              {item.startPrice && (
                                <p className="text-xs font-semibold mb-4"
                                  style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                                  Rp {Number(String(item.startPrice).replace(/\D/g, "")).toLocaleString("id-ID")}
                                </p>
                              )}
                              <a
                                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo DIEGMA, saya tertarik dengan layanan *${item.title}*. Boleh info lebih lanjut?`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-300"
                                style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}
                              >
                                Tanya via WhatsApp <ArrowRight size={11} />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {items.length === 0 && (
                    <div className="border border-dashed p-10 text-center"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
                      <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#bbb", fontFamily: "'Roboto', Arial, sans-serif" }}>
                        Layanan untuk kategori ini akan segera hadir.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}

        {/* 4. CTA */}
        <section className="py-24" style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Mulai Proyek Anda
                </p>
                <div className="h-px w-8 mx-auto mb-10" style={{ backgroundColor: C.gold }} />
                <h2 className="font-bold text-white mb-6"
                  style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1.15 }}>
                  Siap Mulai Proyek<br />Impian Anda?
                </h2>
                <p className="text-sm leading-relaxed mb-10 mx-auto"
                  style={{ color: "rgba(255,255,255,0.45)", maxWidth: "400px", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Ceritakan kebutuhan ruang Anda. Kami hadirkan solusi desain terbaik — dari konsep hingga realisasi akhir.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG_GENERAL}`} target="_blank" rel="noopener noreferrer">
                    <motion.button
                      whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                      className="font-semibold text-sm px-8 py-3.5 flex items-center gap-2 transition-all duration-300"
                      style={{ borderRadius: 0, backgroundColor: C.gold, color: "#111", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Konsultasi via WhatsApp <ArrowRight size={14} />
                    </motion.button>
                  </a>
                  <a href="/contact">
                    <motion.button
                      whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }} whileTap={{ scale: 0.97 }}
                      className="border text-sm font-semibold px-8 py-3.5 transition-all duration-300 flex items-center gap-2"
                      style={{ borderRadius: 0, borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.75)", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Hubungi Kami <ArrowRight size={14} />
                    </motion.button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
