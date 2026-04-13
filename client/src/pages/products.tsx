import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Search, ImageIcon, Loader2, MessageCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

type CategoryKey = "all" | "interior" | "konstruksi" | "furniture";

interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  price: string;
  description: string;
  imageUrl: string;
  visible: boolean;
}

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };

const CATEGORIES = [
  { value: "all",        label: "All Products" },
  { value: "interior",   label: "Interior Design" },
  { value: "konstruksi", label: "Construction" },
  { value: "furniture",  label: "Furniture" },
];

const getCatLabel = (val: string) =>
  CATEGORIES.find(c => c.value === val)?.label || val;

const WA_NUMBER = "6281239243317";
const HERO_IMG_DEFAULT =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80";

export default function ProductsPage() {
  const [products, setProducts]             = useState<Product[]>([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [heroImage, setHeroImage]           = useState("");

  useEffect(() => {
    (async () => {
      // Fetch hero image
      try {
        const snap = await getDoc(doc(db, "settings", "pages"));
        if (snap.exists() && snap.data().produkHeroImage) setHeroImage(snap.data().produkHeroImage);
      } catch {}
      setLoading(true);
      try {
        let snap;
        try {
          snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
        } catch {
          snap = await getDocs(collection(db, "products"));
        }
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter(p => p.visible !== false);
        items.sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setProducts(items);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = products.filter(p =>
    (activeCategory === "all" || p.category === activeCategory) &&
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const waMsg = encodeURIComponent(
    "Halo DIEGMA,\n\nSaya ingin berkonsultasi mengenai produk yang tersedia.\n\nTerima kasih!"
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />

      {/* ═══ 01 · HERO ═══ */}
      <section className="relative w-full overflow-hidden" style={{ height: "72vh", minHeight: "520px" }}>
        <motion.img
          src={heroImage || HERO_IMG_DEFAULT} alt="DIEGMA Produk Hero"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.07 }} animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.38) 55%,rgba(0,0,0,0.14) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.42) 0%,transparent 65%)" }} />

        {/* Badge top-right */}
        <motion.div className="absolute top-24 right-6 sm:right-10 lg:right-16"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}>
          <div className="border border-white/20 px-4 py-2 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 font-medium">Premium Design Studio</p>
          </div>
        </motion.div>

        {/* Teks utama */}
        <motion.div className="absolute left-0 px-6 sm:px-10 lg:px-16" style={{ bottom: "10vh", maxWidth: "720px" }}
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
              Katalog Premium
            </p>
          </div>
          <h1 className="font-bold text-white leading-tight mb-5 drop-shadow-lg"
            style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontFamily: "'Roboto', Arial, sans-serif" }}>
            Solusi Desain<br />Untuk Setiap Ruang.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-md" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
            Temukan produk interior, konstruksi, dan furniture pilihan — setiap karya dikerjakan dengan standar kualitas tertinggi.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">Scroll</p>
          <motion.div className="w-px bg-white/30" style={{ height: "40px" }}
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </section>

      {/* ═══ 02 · FILTER & SEARCH (Minimalist Japandi Style) ═══ */}
      <section className="sticky z-30" style={{ top: "70px", backgroundColor: C.pearl }}>
        <div className="container mx-auto px-6 lg:px-16 border-b border-black/5">
          <div className="py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">

            {/* Filter Text Links — horizontal scroll on mobile */}
            <div className="w-full md:w-auto overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0 pb-1 md:pb-0">
            <div className="flex flex-nowrap gap-5 lg:gap-8 min-w-max md:min-w-0">
              {CATEGORIES.map(cat => (
                <button key={cat.value}
                  onClick={() => setActiveCategory(cat.value as CategoryKey)}
                  className={`text-[13px] tracking-wide pb-1 transition-all duration-300 relative ${
                    activeCategory === cat.value
                      ? "text-black font-medium"
                      : "text-gray-400 hover:text-black"
                  }`}
                  style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {cat.label}
                  {/* Underline Indicator */}
                  {activeCategory === cat.value && (
                    <motion.div 
                      layoutId="activeFilter"
                      className="absolute left-0 right-0 -bottom-[1px] h-[1px] bg-black"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            </div>

            {/* Search — Minimalist */}
            <div className="relative w-full md:w-56 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black transition-colors" />
              <input type="text" placeholder="Search..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-[13px] bg-transparent outline-none border-b border-transparent focus:border-black transition-colors duration-300 placeholder:text-gray-400"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", color: C.text }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 03 · GRID PRODUK (Gallery Style) ═══ */}
      <section className="py-16 pb-28" style={{ backgroundColor: C.pearl }}>
        <div className="container mx-auto px-6 lg:px-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div key={activeCategory + searchQuery}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-16">
                  {filtered.map((product, index) => (
                    <motion.div key={product.id}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}>
                      <Link href={`/products/${product.id}`}>
                        <div className="group cursor-pointer flex flex-col h-full">

                          {/* Area Gambar — Galeri Minimalis */}
                          <div className="relative overflow-hidden bg-[#F5F5F5] group-hover:bg-[#EAEAEA] transition-colors duration-500 w-full"
                            style={{ aspectRatio: "4/5" }}>
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-4 sm:p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Info — Bersih, tanpa tombol beli */}
                          <div className="mt-5 flex flex-col">
                            <h3 className="text-[15px] font-medium leading-snug text-[#1A1A1A] group-hover:opacity-60 transition-opacity duration-300"
                              style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                              {product.name}
                            </h3>
                            <p className="text-[13px] text-[#666] mt-1.5" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                              {product.price ? `IDR ${Number(String(product.price).replace(/\D/g, "")).toLocaleString("id-ID")}` : "By Request"}
                            </p>
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                  <p className="text-sm text-gray-400 mb-1">
                    {products.length === 0 ? "Belum ada produk tersedia." : "Produk tidak ditemukan."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ═══ 04 · CTA ═══ */}
      <section className="py-24" style={{ backgroundColor: C.dark }}>
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold"
                  style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>Produk Custom</p>
              </div>
              <h2 className="font-bold text-white leading-tight mb-4"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)" }}>
                Tidak Menemukan<br />Yang Anda Cari?
              </h2>
              <p className="leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Roboto', Arial, sans-serif", fontSize: "0.95rem" }}>
                Kami melayani proyek custom sesuai kebutuhan Anda — dari konsep hingga eksekusi. Konsultasikan langsung dengan tim kami.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: C.gold, color: C.dark, fontFamily: "'Roboto', Arial, sans-serif" }}>
                <MessageCircle className="w-4 h-4" />
                Konsultasi via WhatsApp
              </a>
              <Link href="/services">
                <span className="flex items-center justify-center gap-2 px-8 py-4 font-medium text-sm transition-all duration-200 cursor-pointer hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.75)", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Lihat Layanan Kami <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}