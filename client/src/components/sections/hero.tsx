import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const WA_NUMBER = "6281239243317";
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

interface HeroSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
}

const DEFAULTS: HeroSettings = {
  heroTitle: "Menciptakan desain,\nyang berbicara tentang\ndan untuk Anda",
  heroSubtitle: "Kami percaya bahwa dengan berkomunikasi dengan Anda, kami dapat menghasilkan solusi khusus yang dibuat secara profesional yang akan menyenangkan dan memuaskan Anda, sehingga Anda dapat menjalankan pekerjaan Anda dengan lebih efektif.",
  heroButtonText: "Konsultasi Sekarang",
  heroImage: DEFAULT_HERO_IMAGE,
};

export function Hero() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) setSettings({ ...DEFAULTS, ...snap.data() as HeroSettings });
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  return (
    <section id="beranda" className="bg-white pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }} className="pr-0 md:pr-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 whitespace-pre-line">
              {settings.heroTitle}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[#4A4A4A] text-base md:text-lg mb-6 max-w-lg">
              {settings.heroSubtitle}
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo DIEGMA, saya ingin konsultasi mengenai proyek saya.")}`}
              target="_blank" rel="noopener noreferrer"
            >
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="bg-black text-white rounded-full py-3.5 px-8 flex items-center transition-all shadow-md"
              >
                <span className="mr-2.5">{settings.heroButtonText}</span>
                <ArrowRight size={16} />
              </motion.button>
            </a>
          </motion.div>
        </div>

        {/* Hero Image - bisa diubah dari admin */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }} className="mt-6"
        >
          <img
            src={settings.heroImage || DEFAULT_HERO_IMAGE}
            alt="Desain interior modern"
            className="w-full h-auto object-cover rounded-md shadow-xl"
            onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO_IMAGE; }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-4">
              Desain interior - ini bukan hanya estetika, tetapi juga menciptakan ruang yang fungsional dan nyaman
            </h3>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[#4A4A4A]">
              Setiap proyek dikembangkan secara individual dan profesional dengan mempertimbangkan semua kebutuhan klien. Tim kami tahu bagaimana menciptakan ruang yang nyaman, fungsional, dan ergonomis tanpa mengorbankan keindahan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
