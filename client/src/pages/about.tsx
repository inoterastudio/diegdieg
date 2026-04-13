import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Award, Clock, GraduationCap, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };
const WA = "6281239243317";
const WA_MSG = encodeURIComponent("Halo DIEGMA, saya ingin konsultasi mengenai proyek saya.");

const HERO_IMG_DEFAULT = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80";
const STORY_IMG_DEFAULT = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80";

interface AboutSettings {
  headline: string;
  description1: string;
  description2: string;
  heroImage?: string;
  aboutSectionImage?: string;
  aboutStudioImage?: string;
  vision: string;
  mission: string;
  values: { title: string; description: string }[];
}

const DEFAULTS: AboutSettings = {
  headline: "Studio Arsitektur & Desain Interior.",
  description1:
    "DIEGMA lahir dari keyakinan bahwa setiap ruang memiliki potensi untuk menjadi karya yang bermakna — bukan sekadar tempat tinggal, tapi ekspresi jiwa penghuninya.",
  description2:
    "Dengan para profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal, perencanaan ruang, hingga implementasi akhir yang melampaui ekspektasi.",
  vision:
    "Menjadi studio desain terkemuka yang mengubah ruang menjadi pengalaman hidup yang luar biasa bagi setiap klien.",
  mission:
    "Memberikan solusi desain terbaik yang memadukan estetika, fungsi, dan keberlanjutan dengan standar kualitas tertinggi.",
  values: [
    { title: "Kualitas Premium",  description: "Kami berkomitmen memberikan hasil dengan standar tertinggi di setiap aspek karya kami." },
    { title: "Kolaborasi",        description: "Proses desain yang melibatkan Anda di setiap tahapan untuk hasil yang benar-benar personal." },
    { title: "Ketepatan Waktu",   description: "Menghargai waktu Anda dengan menyelesaikan setiap proyek sesuai jadwal yang ditetapkan." },
    { title: "Inovasi",           description: "Terus menghadirkan solusi desain terkini yang relevan, unik, dan bermakna." },
  ],
};

const VALUE_NUMS = ["01", "02", "03", "04"];

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutSettings>(DEFAULTS);
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [aboutSnap, pagesSnap] = await Promise.all([
          getDoc(doc(db, "settings", "about")),
          getDoc(doc(db, "settings", "pages")),
        ]);
        if (aboutSnap.exists()) setSettings(prev => ({ ...prev, ...(aboutSnap.data() as Partial<AboutSettings>) }));
        if (pagesSnap.exists() && pagesSnap.data().tentangHeroImage) setHeroImage(pagesSnap.data().tentangHeroImage);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const displayValues = settings.values?.length > 0 ? settings.values : DEFAULTS.values;
  const storyImg = settings.aboutStudioImage || settings.aboutSectionImage || STORY_IMG_DEFAULT;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* ═══ 1. HERO ═══ */}
        <section
          className="relative w-full overflow-hidden"
          style={{ height: "72vh", minHeight: "560px" }}
        >
          <motion.img
            src={heroImage || HERO_IMG_DEFAULT}
            alt="DIEGMA About Hero"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            onError={e => { (e.currentTarget as HTMLImageElement).src = HERO_IMG; }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.38) 55%,rgba(0,0,0,0.14) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.42) 0%,transparent 65%)" }} />

          {/* Badge top-right */}
          <motion.div
            className="absolute top-24 right-6 sm:right-10 lg:right-16"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="border border-white/20 px-4 py-2 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 font-medium">Premium Design Studio</p>
            </div>
          </motion.div>

          {/* Teks utama */}
          <motion.div
            className="absolute left-0 px-6 sm:px-10 lg:px-16"
            style={{ bottom: "10vh", maxWidth: "720px" }}
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: C.gold }}>
                Tentang DIEGMA
              </p>
            </div>
            <h1
              className="font-bold text-white leading-tight mb-5 drop-shadow-lg"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontFamily: "'Roboto', Arial, sans-serif" }}
            >
              Di Mana Setiap<br />Ruang Bercerita.
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-md" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
              Studio arsitektur dan desain interior yang lahir dari kecintaan mendalam terhadap material alami dan keahlian sejati.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Scroll</span>
            <motion.div
              className="w-px bg-white/30"
              style={{ height: "36px" }}
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        {/* ═══ 2. CERITA KAMI ═══ */}
        <section className="py-24" style={{ backgroundColor: C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Teks */}
              <motion.div
                initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.75 }}
                className="max-w-xl"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Cerita Kami
                </p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
                <h2
                  className="font-bold leading-tight mb-7"
                  style={{ fontSize: "clamp(1.9rem,3vw,2.8rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  {settings.headline}
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: "#555", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {settings.description1}
                </p>
                <p className="text-base leading-relaxed mb-10" style={{ color: "#777", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {settings.description2}
                </p>
                <Link href="/services">
                  <motion.button
                    whileHover={{ backgroundColor: C.gold, borderColor: C.gold }}
                    whileTap={{ scale: 0.97 }}
                    className="border text-sm font-semibold px-7 py-3 transition-colors duration-300 flex items-center gap-2"
                    style={{ borderRadius: 0, borderColor: C.text, color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                  >
                    Lihat Layanan Kami <ArrowRight size={14} />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Foto */}
              <motion.div
                initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.15 }}
                className="relative"
              >
                <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  <img
                    src={storyImg}
                    alt="DIEGMA Studio"
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = STORY_IMG_DEFAULT; }}
                  />
                </div>
                {/* Dekorasi gold block */}
                <div
                  className="absolute -bottom-5 -left-5 hidden lg:block"
                  style={{ zIndex: -1, backgroundColor: C.gold, width: "80px", height: "80px" }}
                />

              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ 3. VISI & MISI — Dark ═══ */}
        <section className="py-20" style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="mb-14"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Arah & Tujuan Kami
              </p>
              <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Visi */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65 }}
                className="pr-0 md:pr-14 pb-12 md:pb-0 border-b md:border-b-0 md:border-r"
                style={{ borderColor: "rgba(255,215,0,0.18)" }}
              >
                <span
                  className="block font-bold leading-none mb-4 select-none"
                  style={{ fontSize: "72px", color: "rgba(255,215,0,0.10)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1 }}
                >
                  01
                </span>
                <h3
                  className="font-bold text-white mb-5"
                  style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Visi
                </h3>
                <div className="h-px w-8 mb-6" style={{ backgroundColor: C.gold }} />
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Roboto', Arial, sans-serif", maxWidth: "360px" }}>
                  {settings.vision}
                </p>
              </motion.div>

              {/* Misi */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.15 }}
                className="pl-0 md:pl-14 pt-12 md:pt-0"
              >
                <span
                  className="block font-bold leading-none mb-4 select-none"
                  style={{ fontSize: "72px", color: "rgba(255,215,0,0.10)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1 }}
                >
                  02
                </span>
                <h3
                  className="font-bold text-white mb-5"
                  style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Misi
                </h3>
                <div className="h-px w-8 mb-6" style={{ backgroundColor: C.gold }} />
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Roboto', Arial, sans-serif", maxWidth: "360px" }}>
                  {settings.mission}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ 4. NILAI KAMI ═══ */}
        <section className="py-20" style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="flex items-end justify-between mb-14"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Prinsip Kami
                </p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
                <h2
                  className="font-bold leading-tight"
                  style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Nilai yang Kami<br />Pegang Teguh.
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayValues.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8"
                  style={{ backgroundColor: C.pearl, border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  {/* Gold line animasi bawah */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[3px]"
                    style={{ backgroundColor: C.gold, width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Nomor editorial */}
                  <span
                    className="block font-bold leading-none mb-5 select-none"
                    style={{ fontSize: "52px", color: "rgba(255,215,0,0.22)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1 }}
                  >
                    {VALUE_NUMS[i % VALUE_NUMS.length]}
                  </span>
                  <h3
                    className="font-semibold mb-3 transition-colors duration-300 group-hover:text-yellow-600"
                    style={{ fontSize: "15px", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}
                  >
                    {v.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 5. CTA — Berkolaborasi ═══ */}
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
                <h2
                  className="font-bold text-white mb-6"
                  style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1.15 }}
                >
                  Siap Berkolaborasi<br />Bersama Kami?
                </h2>
                <p className="text-sm leading-relaxed mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "400px", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Ceritakan kebutuhan ruang Anda kepada kami. Bersama, kita wujudkan desain yang melampaui ekspektasi — dari konsep hingga realisasi.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer">
                    <motion.button
                      whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                      className="font-semibold text-sm px-8 py-3.5 flex items-center gap-2 transition-all duration-300"
                      style={{ borderRadius: 0, backgroundColor: C.gold, color: "#111", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Konsultasi via WhatsApp <ArrowRight size={14} />
                    </motion.button>
                  </a>
                  <Link href="/services">
                    <motion.button
                      whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }} whileTap={{ scale: 0.97 }}
                      className="border text-sm font-semibold px-8 py-3.5 transition-all duration-300 flex items-center gap-2"
                      style={{ borderRadius: 0, borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.75)", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Lihat Layanan <ArrowRight size={14} />
                    </motion.button>
                  </Link>
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
