import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

interface HeroSettings {
  heroTitle: string; heroSubtitle: string; heroButtonText: string; heroImage: string;
  statProyek: string; statTahun: string; statKlien: string; statKepuasan: string;
  aboutTitle: string; aboutDesc1: string; aboutDesc2: string; aboutSectionImage: string;
}
const DEFAULTS: HeroSettings = {
  heroTitle: "Di Mana Keahlian\nBertemu Keindahan.",
  heroSubtitle: "Kami percaya bahwa desain yang baik harus mencerminkan kepribadian klien, sambil memperhatikan konteks lingkungan dan budaya.",
  heroButtonText: "Konsultasi Sekarang",
  heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80",
  statProyek: "250", statTahun: "27", statKlien: "150", statKepuasan: "98",
  aboutTitle: "Tentang Studio Kami",
  aboutDesc1: "Di DIEGMA, kami percaya desain harus lebih dari sekadar mengisi ruang — ia harus bercerita. Lahir dari kecintaan mendalam terhadap material alami dan keahlian sejati, setiap karya kami dirancang untuk memadukan kehangatan, fungsi, dan keindahan abadi.",
  aboutDesc2: "Dengan tim profesional berpengalaman, kami menawarkan solusi desain komprehensif — mulai dari konsep awal, perencanaan ruang, hingga implementasi akhir yang melampaui ekspektasi.",
  aboutSectionImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
};

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };

const LAYANAN_KATEGORI = [
  { key: "interior-eksterior", num: "01", title: "Desain Interior\n& Eksterior", desc: "Ruang yang bukan sekadar indah — tapi benar-benar hidup. Estetika dan fungsi yang harmonis.", href: "/service/interior-exterior", defaultImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { key: "konstruksi", num: "02", title: "Konstruksi\n& Renovasi", desc: "Dari pondasi hingga finishing, tim kami memastikan kualitas terbaik di setiap tahap pembangunan.", href: "/service/construction", defaultImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" },
  { key: "furniture", num: "03", title: "Furniture\nCustom", desc: "Furniture eksklusif yang dirancang khusus untuk ruang Anda — material pilihan, keahlian terbaik.", href: "/service/furniture", defaultImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" },
];

// Stats dibuat dinamis dari Firebase settings

const SLIDESHOW = [
  { image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80", title: "Wujudkan Ruang Impian Anda",      subtitle: "Dari konsep hingga realisasi, kami hadir di setiap langkah." },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80", title: "Arsitektur yang Bercerita",       subtitle: "Setiap detail dirancang dengan penuh maksud dan jiwa." },
  { image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=80",    title: "Furniture Karya Tangan Terbaik", subtitle: "Kualitas premium, desain eksklusif, tahan generasi." },
];

const WA = "6281239243317";
const WA_MSG = encodeURIComponent("Halo DIEGMA, saya ingin konsultasi mengenai proyek saya.");

const PROYEK_PLACEHOLDER = [
  { id: "1", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80", title: "Villa Modern Bandung",  category: "Residential", location: "Bandung", year: "2024" },
  { id: "2", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80", title: "Office Space Jakarta",  category: "Commercial",  location: "Jakarta", year: "2024" },
  { id: "3", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=80", title: "Rumah Tropis Modern",   category: "Residential", location: "Bali",    year: "2023" },
];

const PRODUK_PLACEHOLDER = [
  { label: "Desain Interior",  img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80" },
  { label: "Furniture Custom",  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" },
  { label: "Konstruksi",        img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80" },
  { label: "Desain Eksterior",  img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80" },
];

function StatCounter({ target, suffix, label, trigger }: { target: number; suffix: string; label: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let v = 0;
    const step = target / (1800 / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [trigger, target]);
  return (
    <div>
      <p className="font-bold leading-none mb-2" style={{ fontSize: "clamp(1.5rem, 5vw, 2.8rem)", color: C.gold }}>{count}{suffix}</p>
      <p className="text-[9px] sm:text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
    </div>
  );
}

export default function Home() {
  const [settings, setSettings]       = useState<HeroSettings>(DEFAULTS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [catImages, setCatImages]      = useState<Record<string,string>>({});
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [proyekItems, setProyekItems]  = useState<any[]>([]);
  const [slideIndex, setSlideIndex]    = useState(0);
  const [statsVisible, setStatsVisible]= useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [subForm, setSubForm]     = useState({ nama: "", email: "", noHp: "" });
  const [subStatus, setSubStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [subError, setSubError]   = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(i => (i + 1) % SLIDESHOW.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const fetchProds = async () => {
          try {
            return await getDocs(query(collection(db, "products"), orderBy("createdAt","desc"), limit(4)));
          } catch {
            return await getDocs(collection(db, "products"));
          }
        };
        const fetchProyek = async () => {
          try {
            return await getDocs(query(collection(db, "proyek"), orderBy("createdAt","desc"), limit(3)));
          } catch {
            return await getDocs(collection(db, "proyek"));
          }
        };
        const [mainSnap, imgSnap, aboutSnap, prodSnap, proyekSnap] = await Promise.all([
          getDoc(doc(db, "settings", "main")),
          getDoc(doc(db, "settings", "layanan-images")),
          getDoc(doc(db, "settings", "about")),
          fetchProds(),
          fetchProyek(),
        ]);
        if (mainSnap.exists())  setSettings(prev => ({ ...prev, ...mainSnap.data() as HeroSettings }));
        if (aboutSnap.exists()) {
          const a = aboutSnap.data() as any;
          setSettings(prev => ({
            ...prev,
            aboutTitle:        a.aboutTitle        || a.headline    || prev.aboutTitle,
            aboutDesc1:        a.aboutDesc1        || a.description1 || prev.aboutDesc1,
            aboutDesc2:        a.aboutDesc2        || a.description2 || prev.aboutDesc2,
            aboutSectionImage: a.aboutSectionImage || a.aboutStudioImage || prev.aboutSectionImage,
          }));
        }
        if (imgSnap.exists())   setCatImages(imgSnap.data() as Record<string,string>);
        const prods = prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter((p:any) => p.visible !== false);
        setFeaturedProducts(prods.slice(0,4));
        setProyekItems(proyekSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
        setSettingsLoaded(true);
      } catch(e) { console.error(e); setSettingsLoaded(true); }
    };
    run();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.nama.trim()) return setSubError("Nama wajib diisi.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subForm.email)) return setSubError("Format email tidak valid.");
    if (subForm.noHp.replace(/\D/g,"").length < 10) return setSubError("No. WhatsApp minimal 10 digit.");
    setSubError(""); setSubStatus("loading");
    try {
      await addDoc(collection(db,"subscribers"), { nama: subForm.nama.trim(), email: subForm.email.trim().toLowerCase(), noHp: subForm.noHp.trim(), createdAt: serverTimestamp() });
      setSubStatus("success"); setSubForm({ nama:"", email:"", noHp:"" });
    } catch { setSubStatus("error"); setSubError("Gagal menyimpan data. Coba lagi."); }
  };

  const proyekData = proyekItems.length > 0 ? proyekItems : PROYEK_PLACEHOLDER;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* ═══ 1. HERO ═══ */}
        <section className="relative w-full overflow-hidden" style={{ height:"100vh", minHeight:"640px" }}>
          {/* Gambar hero — hanya render setelah Firebase selesai load agar tidak flash */}
          {settingsLoaded && (
            <motion.img
              src={settings.heroImage || DEFAULTS.heroImage}
              alt="DIEGMA Hero"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULTS.heroImage; }}
            />
          )}
          {/* Background gelap saat gambar belum loaded */}
          {!settingsLoaded && (
            <div className="absolute inset-0" style={{ backgroundColor: "#0a0a0a" }} />
          )}
          <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.28) 55%,rgba(0,0,0,0.10) 100%)" }}/>
          <div className="absolute inset-0" style={{ background:"linear-gradient(to right,rgba(0,0,0,0.38) 0%,transparent 65%)" }}/>

          {/* Badge */}
          <motion.div className="absolute top-24 right-6 sm:right-10 lg:right-16"
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:1.2 }}>
            <div className="border border-white/25 px-4 py-2 backdrop-blur-sm" style={{ backgroundColor:"rgba(0,0,0,0.35)" }}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-white/70 font-medium">Premium Design Studio</p>
            </div>
          </motion.div>



          {/* Teks */}
          <motion.div className="absolute left-0 px-6 sm:px-10 lg:px-16" style={{ bottom:"10vh", maxWidth:"760px" }}
            initial={{ opacity:0, y:36 }} animate={{ opacity:1, y:0 }} transition={{ duration:1.0, delay:0.5, ease:"easeOut" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor:C.gold }}/>
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color:C.gold }}>DIEGMA Studio</p>
            </div>
            <h1 className="font-bold text-white leading-tight mb-6 drop-shadow-lg"
              style={{ fontSize:"clamp(2.2rem,5vw,4rem)", whiteSpace:"pre-line" }}>{settings.heroTitle}</h1>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-md">{settings.heroSubtitle}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ backgroundColor:C.gold, borderColor:C.gold }} whileTap={{ scale:0.97 }}
                  className="bg-white text-gray-900 font-semibold text-sm py-3.5 px-8 flex items-center gap-2 shadow-2xl transition-all duration-300" style={{ borderRadius:0 }}>
                  {settings.heroButtonText} <ArrowRight size={15}/>
                </motion.button>
              </a>

            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5" style={{ transform:"translateX(-50%)" }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1, delay:1.6 }}>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-medium">Scroll</span>
            <motion.div className="w-px bg-white/35" style={{ height:"36px" }}
              animate={{ scaleY:[0.3,1,0.3], opacity:[0.3,1,0.3] }} transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}/>
          </motion.div>
        </section>

        {/* ═══ 2. STATS — Dark, count-up ═══ */}
        <section ref={statsRef} style={{ backgroundColor:C.dark }}>
          <div className="container mx-auto px-6 lg:px-16 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Pencapaian Kami</p>
                <div className="h-px w-10 mb-10" style={{ backgroundColor:C.gold }}/>
                <div className="grid grid-cols-3 gap-0">
                  {[
                    { value: parseInt(settings.statProyek||"250"), suffix: "+", label: "Proyek Selesai" },
                    { value: parseInt(settings.statTahun||"27"),   suffix: "+", label: "Tahun Pengalaman" },
                    { value: parseInt(settings.statKepuasan||"98"), suffix: "%", label: "Kepuasan Klien" },
                  ].map((s,i) => (
                    <div key={i} className={`py-2 ${i > 0 ? "pl-5 sm:pl-8 border-l" : ""} ${i < 2 ? "pr-5 sm:pr-8" : ""}`}
                      style={{ borderColor:"rgba(255,255,255,0.1)" }}>
                      <StatCounter target={s.value} suffix={s.suffix} label={s.label} trigger={statsVisible}/>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.15 }} className="max-w-md">
                <p className="text-sm leading-relaxed mb-8" style={{ color:"rgba(255,255,255,0.5)" }}>
                  Lebih dari dua dekade kami membangun kepercayaan klien melalui karya yang melampaui ekspektasi — dari hunian pribadi, ruang komersial, hingga furniture eksklusif.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/about">
                    <motion.button whileHover={{ backgroundColor:C.gold, color:"#111" }} whileTap={{ scale:0.97 }}
                      className="text-sm font-semibold px-7 py-3 transition-all duration-300 border"
                      style={{ borderRadius:0, borderColor:"rgba(255,255,255,0.25)", color:"rgba(255,255,255,0.8)" }}>
                      Tentang Kami
                    </motion.button>
                  </Link>
                  <Link href="/contact">
                    <motion.button whileHover={{ opacity:0.85 }} whileTap={{ scale:0.97 }}
                      className="text-sm font-semibold px-7 py-3 transition-all duration-300 flex items-center gap-2"
                      style={{ borderRadius:0, backgroundColor:C.gold, color:"#111" }}>
                      Konsultasi Kami <ArrowRight size={14}/>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ 3. PRODUK — Pearl, card grid ═══ */}
        <section className="py-20" style={{ backgroundColor:C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16">

            {/* Header */}
            <motion.div className="flex items-end justify-between mb-10"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Produk Kami</p>
                <div className="h-px w-8 mb-5" style={{ backgroundColor:C.gold }}/>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color:C.text }}>
                  Koleksi untuk<br/>Setiap Ruang.
                </h2>
              </div>
              <Link href="/products">
                <motion.span whileHover={{ x:3 }}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors border-b pb-0.5 cursor-pointer"
                  style={{ color:C.text, borderColor:"#bbb" }}>
                  Lihat Semua <ArrowRight size={13}/>
                </motion.span>
              </Link>
            </motion.div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(featuredProducts.length > 0
                ? featuredProducts.map((p:any) => ({
                    img: p.imageUrl, label: p.name,
                    href: `/products/${p.id}`, price: p.price
                  }))
                : PRODUK_PLACEHOLDER.map((item) => ({
                    img: item.img, label: item.label,
                    href: "/products", price: null
                  }))
              ).map((item:any, i:number) => (
                <Link key={i} href={item.href}>
                  <motion.div
                    className="group cursor-pointer bg-white border border-gray-100 hover:border-[#FFD700] hover:shadow-md transition-all duration-300"
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.08 }}
                    style={{ borderRadius:0 }}>

                    {/* Gambar */}
                    <div className="relative overflow-hidden" style={{ aspectRatio:"1/1", backgroundColor:"#EDEBE7" }}>
                      {item.img ? (
                        <img src={item.img} alt={item.label}
                          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-300 text-xs">No Image</span>
                        </div>
                      )}
                      {/* Gold left-border on hover */}
                      <div className="absolute top-0 left-0 h-full w-[3px] bg-[#FFD700] scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-bottom"/>
                    </div>

                    {/* Info */}
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold leading-snug group-hover:text-[#B8860B] transition-colors duration-300"
                        style={{ color:C.text }}>{item.label}</p>
                      {item.price ? (
                        <p className="text-xs mt-1 font-medium" style={{ color:C.gold }}>
                          IDR {Number(String(item.price).replace(/\D/g, "")).toLocaleString("id-ID")}
                        </p>
                      ) : (
                        <p className="text-xs mt-1" style={{ color:"#aaa" }}>Hubungi Kami</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="flex md:hidden justify-center mt-8">
              <Link href="/products">
                <span className="text-sm font-medium flex items-center gap-1.5 border-b pb-0.5 cursor-pointer"
                  style={{ color:C.text, borderColor:"#bbb" }}>
                  Lihat Semua Produk <ArrowRight size={13}/>
                </span>
              </Link>
            </div>

          </div>
        </section>

        {/* ═══ 4. LAYANAN — 3 panel editorial ═══ */}
        <section className="py-20" style={{ backgroundColor:C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div className="flex items-end justify-between mb-12"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Apa yang Kami Tawarkan</p>
                <h2 className="text-3xl md:text-4xl font-bold leading-snug" style={{ color:C.text }}>Jelajahi<br/>Layanan Kami</h2>
              </div>
              <Link href="/services">
                <motion.span whileHover={{ x:3 }}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors border-b pb-0.5 cursor-pointer"
                  style={{ color:C.text, borderColor:"#bbb" }}>
                  Semua Layanan <ArrowRight size={13}/>
                </motion.span>
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAYANAN_KATEGORI.map((item,i) => {
                const imgSrc = catImages[item.key] || item.defaultImage;
                return (
                  <Link key={item.key} href={item.href}>
                    <motion.div className="group relative overflow-hidden cursor-pointer h-[280px] sm:h-[380px] md:h-[460px]"
                      initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.12 }}>
                      <img src={imgSrc} alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = item.defaultImage; }}/>
                      <div className="absolute inset-0 transition-opacity duration-500"
                        style={{ background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.32) 55%,rgba(0,0,0,0.08) 100%)" }}/>
                      <div className="absolute top-6 left-6">
                        <span className="text-[11px] font-bold tracking-widest" style={{ color:C.gold }}>{item.num}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 p-7 text-white w-full">
                        <h3 className="text-xl md:text-2xl font-bold leading-snug mb-3 group-hover:text-yellow-300 transition-colors duration-300"
                          style={{ whiteSpace:"pre-line" }}>{item.title}</h3>
                        <p className="text-[13px] text-gray-300 leading-relaxed mb-5 max-w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-400">{item.desc}</p>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                          <span>Pelajari Lebih Lanjut</span><ArrowRight size={12}/>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor:C.gold }}/>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
            <div className="flex md:hidden justify-center mt-8">
              <Link href="/services">
                <span className="text-sm font-medium flex items-center gap-1.5 border-b pb-0.5 cursor-pointer transition-colors" style={{ color:C.text, borderColor:"#bbb" }}>
                  Semua Layanan <ArrowRight size={13}/>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 5. PROYEK — Full-bleed + grid ═══ */}
        <section className="py-20" style={{ backgroundColor:C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div className="flex items-end justify-between mb-12"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Karya Terpilih</p>
                <h2 className="text-3xl md:text-4xl font-bold leading-snug text-white">Portofolio<br/>DIEGMA.</h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Foto besar */}
              <motion.div className="lg:col-span-3 relative overflow-hidden h-[280px] sm:h-[380px] lg:h-[520px]"
                initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
                  <img src={proyekData[0].image||"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80"} alt={proyekData[0].title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80"; }}/>
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 60%)" }}/>
                  <div className="absolute top-5 left-5">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5"
                      style={{ backgroundColor:"rgba(255,215,0,0.15)", color:C.gold, border:"1px solid rgba(255,215,0,0.3)" }}>
                      {proyekData[0].category||"Residential"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-7 text-white">
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color:"rgba(255,255,255,0.4)" }}>
                      {proyekData[0].location} — {proyekData[0].year}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{proyekData[0].title}</h3>
                  </div>
              </motion.div>

              {/* 2 foto kecil */}
              <div className="lg:col-span-2 grid grid-rows-2 gap-4 h-[280px] sm:h-[380px] lg:h-[520px]">
                {proyekData.slice(1,3).map((p:any, i:number) => (
                  <motion.div key={p.id} className="relative overflow-hidden"
                    initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.1+i*0.12 }}>
                      <img src={p.image||"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"} alt={p.title}
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"; }}/>
                      <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.08) 55%)" }}/>
                      <div className="absolute bottom-0 left-0 p-5 text-white">
                        <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color:"rgba(255,255,255,0.4)" }}>
                          {p.category||"Interior"} — {p.year}
                        </p>
                        <h4 className="text-sm font-bold leading-snug">{p.title}</h4>
                      </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <Link href="/contact">
                <motion.button whileHover={{ backgroundColor:C.gold, color:"#111" }} whileTap={{ scale:0.97 }}
                  className="text-sm font-semibold px-8 py-3.5 transition-all duration-300 border flex items-center gap-2"
                  style={{ borderRadius:0, borderColor:"rgba(255,255,255,0.25)", color:"rgba(255,255,255,0.8)" }}>
                  Mulai Konsultasi <ArrowRight size={14}/>
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 6. TENTANG KAMI ═══ */}
        <section className="py-20" style={{ backgroundColor:C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="max-w-xl">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Tentang Kami</p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor:C.gold }}/>
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color:C.text }}>
                  {settings.aboutDesc1 || DEFAULTS.aboutDesc1}
                </p>
                <p className="text-sm leading-relaxed mb-10" style={{ color:"#777" }}>
                  {settings.aboutDesc2 || DEFAULTS.aboutDesc2}
                </p>
                <Link href="/about">
                  <motion.button whileHover={{ backgroundColor:C.gold, borderColor:C.gold }}
                    className="border text-sm font-semibold px-7 py-3 transition-colors duration-300"
                    style={{ borderRadius:0, borderColor:C.text, color:C.text }}>
                    Pelajari Lebih Lanjut
                  </motion.button>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.15 }} className="relative">
                <div className="overflow-hidden" style={{ aspectRatio:"4/5" }}>
                  <img
                    src={settings.aboutSectionImage || DEFAULTS.aboutSectionImage}
                    alt="DIEGMA Studio"
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULTS.aboutSectionImage; }}
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 w-28 h-28 hidden lg:block" style={{ zIndex:-1, backgroundColor:C.gold }}/>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ 7. SLIDESHOW ═══ */}
        <section className="relative w-full overflow-hidden h-[420px] sm:h-[520px] md:h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div key={slideIndex} className="absolute inset-0"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:1.2 }}>
              <img src={SLIDESHOW[slideIndex].image} alt={SLIDESHOW[slideIndex].title} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(10,8,5,0.78) 0%,rgba(10,8,5,0.28) 50%,rgba(10,8,5,0.08) 100%)" }}/>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 flex flex-col justify-between px-8 md:px-14 py-12" style={{ zIndex:10 }}>
            <div/>
            <div className="flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.div key={slideIndex} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-10 }} transition={{ duration:0.65 }} style={{ maxWidth:"520px" }}>
                  <div className="h-px w-10 mb-5" style={{ backgroundColor:C.gold }}/>
                  <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">{SLIDESHOW[slideIndex].title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)", maxWidth:"380px" }}>{SLIDESHOW[slideIndex].subtitle}</p>
                </motion.div>
              </AnimatePresence>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Halo DIEGMA, saya ingin mengetahui lebih lanjut tentang layanan Anda.")}`} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ backgroundColor:C.gold, color:"#111" }} whileTap={{ scale:0.97 }}
                  className="bg-white text-gray-900 font-semibold text-xs px-6 py-2.5 transition-all duration-300 flex-shrink-0" style={{ borderRadius:0 }}>
                  Temukan Lebih Lanjut
                </motion.button>
              </a>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {SLIDESHOW.map((_,i) => (
                <button key={i} onClick={() => setSlideIndex(i)} className="transition-all duration-300"
                  style={{ width:i===slideIndex?"28px":"7px", height:"7px", backgroundColor:i===slideIndex?C.gold:"rgba(255,255,255,0.35)" }}/>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 8. KONTAK — 3 info cards ═══ */}
        <section className="py-20" style={{ backgroundColor:C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div className="text-center mb-14"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:C.gold }}>Hubungi Kami</p>
              <div className="h-px w-8 mx-auto mb-8" style={{ backgroundColor:C.gold }}/>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color:C.text }}>Siap Memulai<br/>Proyek Anda?</h2>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color:"#777" }}>
                Tim kami siap membantu mewujudkan ruang impian Anda. Hubungi kami melalui saluran yang paling nyaman.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { num:"01", icon:"💬", title:"WhatsApp", desc:"Respon cepat untuk konsultasi awal, pertanyaan, dan diskusi proyek Anda.", action:"Chat Sekarang", href:`https://wa.me/${WA}?text=${WA_MSG}`, external:true },
                { num:"02", icon:"✉️", title:"Email", desc:"Kirim detail proyek Anda secara lengkap dan kami akan membalas dalam 1×24 jam.", action:"Kirim Email", href:"mailto:info@diegma.com", external:true },
                { num:"03", icon:"📍", title:"Kunjungi Kami", desc:"Datang langsung ke studio kami untuk konsultasi tatap muka dan melihat portofolio.", action:"Lihat Lokasi", href:"/contact", external:false },
              ].map((card,i) => (
                <motion.div key={i} className="group bg-white border border-gray-100 p-8 hover:border-yellow-400 hover:shadow-md transition-all duration-300" style={{ borderRadius:0 }}
                  initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.55, delay:i*0.1 }}>
                  <span className="text-[10px] font-bold tracking-widest mb-4 block" style={{ color:C.gold }}>{card.num}</span>
                  <div className="text-3xl mb-5">{card.icon}</div>
                  <div className="w-10 h-px mb-5" style={{ backgroundColor:C.gold }}/>
                  <h3 className="text-lg font-bold mb-3 transition-colors duration-300 group-hover:text-yellow-600" style={{ color:C.text }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color:"#777" }}>{card.desc}</p>
                  {card.external ? (
                    <a href={card.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors duration-300 border-b pb-0.5 group-hover:text-yellow-600 group-hover:border-yellow-500"
                      style={{ color:C.text, borderColor:"#bbb" }}>
                      {card.action} <ArrowRight size={11}/>
                    </a>
                  ) : (
                    <Link href={card.href}>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors duration-300 border-b pb-0.5 group-hover:text-yellow-600 group-hover:border-yellow-500 cursor-pointer"
                        style={{ color:C.text, borderColor:"#bbb" }}>
                        {card.action} <ArrowRight size={11}/>
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center"
              initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.35 }}>
              <Link href="/contact">
                <motion.button whileHover={{ backgroundColor:C.gold, borderColor:C.gold }} whileTap={{ scale:0.97 }}
                  className="border text-sm font-semibold px-8 py-3.5 transition-colors duration-300 inline-flex items-center gap-2"
                  style={{ borderRadius:0, borderColor:C.text, color:C.text }}>
                  Atau Isi Form Lengkap <ArrowRight size={14}/>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══ 9. SUBSCRIBE ═══ */}
        <section style={{ backgroundColor:C.linen }}>
          <div className="container mx-auto px-6 lg:px-16 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color:C.gold }}>Newsletter</p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor:C.gold }}/>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color:C.text }}>Dapatkan Inspirasi<br/>Langsung ke Anda.</h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color:"#777", maxWidth:"360px" }}>
                  Jadilah yang pertama mendapatkan update proyek terbaru, penawaran eksklusif, dan inspirasi desain terpilih dari tim DIEGMA.
                </p>
                <div className="space-y-3">
                  {["Update proyek & koleksi terbaru","Penawaran dan diskon eksklusif","Tips desain interior dari ahlinya"].map((item,i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ backgroundColor:C.gold }}>
                        <Check size={11} strokeWidth={3} color="#111"/>
                      </div>
                      <span className="text-sm" style={{ color:"#555" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.15 }}>
                {subStatus === "success" ? (
                  <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}
                    className="flex flex-col items-center justify-center text-center py-14 px-8 bg-white border border-gray-100" style={{ borderRadius:0 }}>
                    <div className="w-14 h-14 flex items-center justify-center mb-5" style={{ backgroundColor:C.gold }}>
                      <Check size={26} strokeWidth={3} color="#111"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color:C.text }}>Terima Kasih!</h3>
                    <p className="text-sm mb-6" style={{ color:"#777" }}>Data Anda berhasil disimpan. Kami akan menghubungi Anda segera.</p>
                    <button onClick={() => setSubStatus("idle")} className="text-xs font-semibold border-b pb-0.5 transition-colors hover:text-yellow-600 hover:border-yellow-500" style={{ color:"#777", borderColor:"#bbb" }}>
                      Daftarkan email lain
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="bg-white border border-gray-100 p-8 space-y-4" style={{ borderRadius:0 }}>
                    <div className="space-y-4">
                      {[
                        { key:"nama",  label:"Nama Lengkap", type:"text",  ph:"Masukkan nama lengkap Anda" },
                        { key:"email", label:"Alamat Email",  type:"email", ph:"nama@email.com" },
                        { key:"noHp",  label:"No. WhatsApp",  type:"tel",   ph:"08xxxxxxxxxx" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color:"#999" }}>{f.label}</label>
                          <input type={f.type} placeholder={f.ph}
                            value={subForm[f.key as keyof typeof subForm]}
                            onChange={e => setSubForm(p => ({ ...p, [f.key]:e.target.value }))}
                            className="w-full px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder-gray-400"
                            style={{ borderRadius:0, borderColor:"#E5E7EB", backgroundColor:"#F9F9F7", color:C.text }}
                            onFocus={e => e.currentTarget.style.borderColor=C.gold}
                            onBlur={e => e.currentTarget.style.borderColor="#E5E7EB"}
                          />
                        </div>
                      ))}
                    </div>
                    {subError && <p className="text-xs text-red-500 font-medium">{subError}</p>}
                    <motion.button type="submit" disabled={subStatus==="loading"} whileHover={{ opacity:0.9 }} whileTap={{ scale:0.98 }}
                      className="w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 transition-all duration-300 disabled:opacity-60"
                      style={{ backgroundColor:C.gold, color:"#111", borderRadius:0 }}>
                      {subStatus==="loading" ? <><Loader2 size={15} className="animate-spin"/> Menyimpan...</> : <><ArrowRight size={15}/> Daftarkan Saya</>}
                    </motion.button>
                    <p className="text-[11px] text-center leading-relaxed" style={{ color:"#aaa" }}>
                      Data Anda aman dan tidak akan dibagikan ke pihak ketiga.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
