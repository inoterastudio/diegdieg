import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const C = { pearl: "#FAF8F5", gold: "#FFD700", text: "#1A1A1A" };
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80";

export function About() {
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [text1, setText1] = useState(
    "DIEGMA adalah studio arsitektur dan desain interior yang berdedikasi untuk menciptakan ruang yang fungsional, estetis, dan bermakna. Kami percaya desain yang baik harus mencerminkan kebutuhan dan kepribadian klien, sambil memperhatikan konteks lingkungan dan budaya."
  );
  const [text2, setText2] = useState(
    "Dengan para profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal hingga implementasi akhir — setiap proyek ditangani dengan perhatian penuh pada detail, kualitas, dan keberlanjutan."
  );

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "about"));
        if (snap.exists()) {
          const d = snap.data();
          if (d.aboutSectionImage) setImageUrl(d.aboutSectionImage);
          if (d.description1) setText1(d.description1);
          if (d.description2) setText2(d.description2);
        }
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  return (
    <section id="tentang-kami" className="py-20" style={{ backgroundColor: C.pearl }}>
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
              Tentang Kami
            </p>
            <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
            <h2
              className="font-bold leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
            >
              Tentang Studio Kami.
            </h2>
            <p className="mb-5 leading-relaxed" style={{ color: "#555", fontSize: "15px", fontFamily: "'Roboto', Arial, sans-serif" }}>
              {text1}
            </p>
            <p className="mb-10 leading-relaxed" style={{ color: "#777", fontSize: "15px", fontFamily: "'Roboto', Arial, sans-serif" }}>
              {text2}
            </p>
            <Link href="/about">
              <motion.span
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium border-b pb-0.5 cursor-pointer transition-colors"
                style={{ color: C.text, borderColor: "#bbb", fontFamily: "'Roboto', Arial, sans-serif" }}
              >
                Pelajari Lebih Lanjut <ArrowRight size={13} />
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img
                src={imageUrl}
                alt="Interior design workspace"
                className="w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
              />
            </div>
            <div
              className="absolute -bottom-5 -left-5"
              style={{ zIndex: -1, backgroundColor: C.gold, width: "72px", height: "72px" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
