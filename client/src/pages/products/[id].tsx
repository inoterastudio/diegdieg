import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Loader2, MessageCircle, Phone, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  specs: string;
  features: string;
  imageUrl: string;
  visible: boolean;
}

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };

const getCatLabel = (val: string) => {
  const map: Record<string, string> = {
    interior:   "Desain Interior",
    konstruksi: "Konstruksi",
    furniture:  "Furniture",
  };
  return map[val] || val;
};

const WA_NUMBER = "6281239243317";

export default function ProductDetailPage() {
  const [, params]  = useRoute("/products/:id");
  const [product, setProduct]   = useState<Product | null>(null);
  const [related, setRelated]   = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "products", params.id));
        if (!snap.exists()) { setNotFound(true); setLoading(false); return; }
        const data = { id: snap.id, ...snap.data() } as Product;
        setProduct(data);
        const all  = (await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))))
          .docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setRelated(all.filter(p => p.id !== data.id && p.category === data.category && p.visible !== false).slice(0, 3));
      } catch (e) { console.error(e); setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [params?.id]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
      </div>
      <Footer />
    </div>
  );

  /* ── Not Found ── */
  if (notFound || !product) return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <p className="font-bold text-2xl" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: C.text }}>
          Produk tidak ditemukan
        </p>
        <Link href="/products">
          <span className="flex items-center gap-2 px-6 py-3 text-sm font-medium cursor-pointer transition-colors hover:opacity-80"
            style={{ backgroundColor: C.dark, color: "#fff", fontFamily: "'Roboto', Arial, sans-serif" }}>
            <ArrowLeft className="w-4 h-4" /> Kembali ke Produk
          </span>
        </Link>
      </div>
      <Footer />
    </div>
  );

  const waMsg       = encodeURIComponent(`Halo DIEGMA, saya tertarik dengan produk *${product.name}*. Boleh saya tahu info lebih lanjut?`);
  const featuresList = product.features ? product.features.split("\n").filter(Boolean) : [];
  const specsList    = product.specs    ? product.specs.split("\n").filter(Boolean)    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />

      {/* ═══ A · DETAIL UTAMA (Pearl) ═══ */}
      <section className="pt-28 pb-20" style={{ backgroundColor: C.pearl }}>
        <div className="container mx-auto px-6 lg:px-16">

          {/* Breadcrumb */}
          <motion.div className="flex items-center gap-2 text-xs mb-10"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Roboto', Arial, sans-serif", color: "#999" }}>
            <Link href="/products">
              <span className="cursor-pointer transition-colors hover:text-black">Produk</span>
            </Link>
            <span style={{ color: C.gold }}>—</span>
            <span>{getCatLabel(product.category)}</span>
            <span style={{ color: C.gold }}>—</span>
            <span className="line-clamp-1" style={{ color: C.text }}>{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Foto — slide dari kiri */}
            <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}>
              <div className="overflow-hidden aspect-[4/3]" style={{ backgroundColor: "#E8E4DC" }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16" style={{ color: "#ccc" }} />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info — slide dari kanan */}
            <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col">

              <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 mb-4 w-fit"
                style={{ backgroundColor: "rgba(255,215,0,0.12)", color: "#B8860B", fontFamily: "'Roboto', Arial, sans-serif" }}>
                {getCatLabel(product.category)}
              </span>

              <h1 className="font-bold leading-tight mb-5"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: C.text }}>
                {product.name}
              </h1>

              {product.price && (
                <div className="mb-6 pb-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <span className="text-2xl font-bold" style={{ color: "#B8860B", fontFamily: "'Roboto', Arial, sans-serif" }}>
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              {product.description && (
                <p className="leading-relaxed mb-8" style={{ color: "#555", fontFamily: "'Roboto', Arial, sans-serif", fontSize: "0.95rem" }}>
                  {product.description}
                </p>
              )}

              {/* Keunggulan */}
              {featuresList.length > 0 && (
                <div className="mb-8">
                  <p className="font-bold mb-4 text-sm tracking-wide uppercase"
                    style={{ color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>
                    Keunggulan
                  </p>
                  <ul className="space-y-2">
                    {featuresList.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm"
                        style={{ color: "#555", fontFamily: "'Roboto', Arial, sans-serif" }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tombol CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold text-sm transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: C.gold, color: C.dark, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  <MessageCircle className="w-4 h-4" />
                  Tanya via WhatsApp
                </a>
                <a href={`tel:+${WA_NUMBER}`}
                  className="flex items-center justify-center gap-2 py-4 px-6 font-medium text-sm transition-all duration-200 hover:bg-black hover:text-white"
                  style={{ border: "1.5px solid rgba(0,0,0,0.2)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  <Phone className="w-4 h-4" />
                  Telepon
                </a>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ B · SPESIFIKASI (Linen) ═══ */}
      {specsList.length > 0 && (
        <section className="py-20" style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
                <h2 className="font-bold"
                  style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: C.text }}>
                  Spesifikasi
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {specsList.map((s, i) => {
                  const [label, ...rest] = s.split(":");
                  const value = rest.join(":").trim();
                  return (
                    <div key={i} className="flex gap-4 py-4"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                      {value ? (
                        <>
                          <span className="text-sm font-medium min-w-[130px]"
                            style={{ color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}>{label}</span>
                          <span className="text-sm" style={{ color: "#777", fontFamily: "'Roboto', Arial, sans-serif" }}>
                            <span style={{ color: C.gold, marginRight: "6px" }}>—</span>{value}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm" style={{ color: "#555", fontFamily: "'Roboto', Arial, sans-serif" }}>{s}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ C · PRODUK TERKAIT (Dark) ═══ */}
      {related.length > 0 && (
        <section className="py-20" style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-12">
                <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
                <h2 className="font-bold text-white"
                  style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)" }}>
                  Produk Terkait
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <Link href={`/products/${p.id}`}>
                      <div className="group cursor-pointer overflow-hidden transition-all duration-300"
                        style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.gold; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                        <div className="overflow-hidden" style={{ height: "180px", backgroundColor: "#222" }}>
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8" style={{ color: "#444" }} />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold leading-snug mb-1 transition-colors group-hover:text-[#FFD700]"
                            style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "1.1rem", color: "#fff" }}>
                            {p.name}
                          </h3>
                          {p.price && (
                            <p className="text-xs font-medium" style={{ color: "#B8860B", fontFamily: "'Roboto', Arial, sans-serif" }}>
                              Rp {Number(p.price).toLocaleString("id-ID")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tombol kembali */}
      <section className="py-12" style={{ backgroundColor: C.pearl }}>
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <Link href="/products">
            <span className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors hover:text-black"
              style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif", borderBottom: "1px solid rgba(0,0,0,0.15)", paddingBottom: "2px" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Produk
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
