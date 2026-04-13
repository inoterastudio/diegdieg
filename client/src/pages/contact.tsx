import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactFormSchema } from "@/lib/form-schema";
import { useToast } from "@/hooks/use-toast";
import {
  PhoneCall, Mail, MapPin, Clock,
  ArrowRight, Send, CheckCircle2, Loader2,
  MessageSquare, Calendar, FileText,
} from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type FormValues = z.infer<typeof contactFormSchema>;

const C = { pearl: "#FAF8F5", linen: "#F2EFE9", dark: "#111111", gold: "#FFD700", text: "#1A1A1A" };
const HERO_IMG_DEFAULT = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=80";
const DEFAULT_MAPS = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2834932528575!2d106.81308937461082!3d-6.226299993773899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f37bccf351%3A0x82de20c2dbd8ec5!2sKemang%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1684151339634!5m2!1sen!2sid";

interface ContactSettings {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  jamOperasional: string;
  mapsUrl: string;
}

const DEFAULT_CONTACT: ContactSettings = {
  whatsapp: "6281239243317",
  phone: "+62 812-3924-3317",
  email: "diegma9@gmail.com",
  address: "Bandung, Jawa Barat, Indonesia",
  jamOperasional: "Senin - Jumat: 08.00 - 17.00 WIB",
  mapsUrl: DEFAULT_MAPS,
};

/* ── shared animation variants ── */
const PROSES = [
  { num: "01", icon: <MessageSquare size={16} />, title: "Kirim Pesan", desc: "Isi form kontak atau chat langsung via WhatsApp dengan detail proyek Anda." },
  { num: "02", icon: <CheckCircle2 size={16} />, title: "Konfirmasi", desc: "Tim kami memverifikasi informasi dan memahami kebutuhan proyek Anda." },
  { num: "03", icon: <Calendar size={16} />, title: "Konsultasi", desc: "Jadwalkan sesi konsultasi dengan tim desainer berpengalaman kami." },
  { num: "04", icon: <FileText size={16} />, title: "Proposal", desc: "Kami hadirkan proposal lengkap sesuai visi dan anggaran Anda." },
];
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const slideL = { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } };
const slideR = { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } };

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT);
  const [heroImage, setHeroImage] = useState("");
  const { toast } = useToast();

  const WA_MSG = encodeURIComponent("Halo DIEGMA, saya ingin konsultasi mengenai proyek saya.");

  useEffect(() => {
    const load = async () => {
      try {
        const [mainSnap, pagesSnap] = await Promise.all([
          getDoc(doc(db, "settings", "main")),
          getDoc(doc(db, "settings", "pages")),
        ]);
        if (mainSnap.exists()) setContactSettings({ ...DEFAULT_CONTACT, ...mainSnap.data() as ContactSettings });
        if (pagesSnap.exists() && pagesSnap.data().kontakHeroImage) setHeroImage(pagesSnap.data().kontakHeroImage);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  // Build INFO_KONTAK dinamis dari Firebase
  const INFO_KONTAK = [
    {
      icon: <PhoneCall size={15} />,
      title: "WhatsApp",
      lines: [contactSettings.phone, "Respon dalam 1×24 jam kerja"],
    },
    {
      icon: <Mail size={15} />,
      title: "Email",
      lines: [contactSettings.email],
    },
    {
      icon: <MapPin size={15} />,
      title: "Alamat Studio",
      lines: [contactSettings.address],
    },
    {
      icon: <Clock size={15} />,
      title: "Jam Operasional",
      lines: [contactSettings.jamOperasional],
    },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", projectType: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (error) {
      toast({
        title: "Gagal mengirim pesan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.pearl }}>
      <Navbar />
      <main>

        {/* ══════════════════════════════════════════
            1. HERO — Dark 72vh + ken-burns
        ══════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden" style={{ height: "72vh", minHeight: "560px" }}>
          {/* Ken-burns photo */}
          <motion.img
            src={heroImage || HERO_IMG_DEFAULT}
            alt="DIEGMA Studio Kontak"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />

          {/* Overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 55%,rgba(0,0,0,0.18) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.50) 0%,transparent 65%)" }} />

          {/* Badge top-right */}
          <motion.div
            className="absolute top-24 right-6 sm:right-10 lg:right-16"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="border border-white/20 px-4 py-2 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 font-medium" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                Premium Design Studio
              </p>
            </div>
          </motion.div>

          {/* Main text */}
          <motion.div
            className="absolute left-0 px-6 sm:px-10 lg:px-16"
            style={{ bottom: "12vh", maxWidth: "680px" }}
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Hubungi DIEGMA
              </p>
            </div>
            <h1
              className="font-bold text-white leading-tight mb-5 drop-shadow-lg"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontFamily: "'Roboto', Arial, sans-serif" }}
            >
              Wujudkan Ruang Impian<br />Anda Bersama Kami.
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-md" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
              Ceritakan proyek Anda — kami hadirkan solusi terbaik dari konsultasi awal hingga realisasi akhir.
            </p>
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

        {/* ══════════════════════════════════════════
            2. INFO KONTAK — Pearl, 2-col
        ══════════════════════════════════════════ */}
        <section className="py-24" style={{ backgroundColor: C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16">

            {/* Header */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="mb-14"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Cara Menghubungi Kami
              </p>
              <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
              <h2
                className="font-bold leading-tight"
                style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
              >
                Kami Siap Mendengar<br />Kebutuhan Anda.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

              {/* LEFT — 4 info cards */}
              <motion.div
                variants={slideL} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INFO_KONTAK.map((info, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp} initial="hidden" whileInView="show"
                      viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}
                      className="group relative overflow-hidden p-6"
                      style={{ backgroundColor: C.linen, border: "1px solid rgba(0,0,0,0.07)" }}
                    >
                      <motion.div
                        className="absolute bottom-0 left-0 h-[3px]"
                        style={{ backgroundColor: C.gold, width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.35 }}
                      />
                      <div
                        className="w-9 h-9 flex items-center justify-center mb-4"
                        style={{ backgroundColor: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.25)", color: C.gold }}
                      >
                        {info.icon}
                      </div>
                      <h3
                        className="font-semibold mb-2 text-sm"
                        style={{ color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                      >
                        {info.title}
                      </h3>
                      {info.lines.map((l, j) => (
                        <p key={j} className="text-xs leading-relaxed" style={{ color: j === 0 ? "#555" : "#999", fontFamily: "'Roboto', Arial, sans-serif" }}>
                          {l}
                        </p>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT — WA CTA + editorial number */}
              <motion.div
                variants={slideR} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.15 }}
                className="relative"
              >
                <p
                  className="font-semibold mb-4 leading-snug"
                  style={{ fontSize: "1.1rem", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Konsultasi langsung via WhatsApp — kami respons cepat.
                </p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "#666", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Tim DIEGMA siap menjawab pertanyaan Anda, memberikan estimasi awal, dan membantu dari tahap konsep hingga realisasi penuh.
                </p>

                <a href={`https://wa.me/${contactSettings.whatsapp}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full border font-semibold text-sm px-7 py-4 transition-all duration-300 flex items-center justify-between"
                    style={{ borderRadius: 0, borderColor: C.text, color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                  >
                    Chat via WhatsApp <ArrowRight size={14} />
                  </motion.button>
                </a>

                <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <p className="text-xs mb-1" style={{ color: "#999", fontFamily: "'Roboto', Arial, sans-serif" }}>Atau kirim email ke</p>
                  <p className="text-sm font-semibold" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>diegma9@gmail.com</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            3. PROSES KONSULTASI — Dark, editorial 01–04
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="mb-14"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                Alur Kerja DIEGMA
              </p>
              <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
              <h2
                className="font-bold leading-tight text-white"
                style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", fontFamily: "'Roboto', Arial, sans-serif" }}
              >
                Empat Langkah Menuju<br />Ruang Sempurna.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROSES.map((p, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,215,0,0.08)" }}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 h-[3px]"
                    style={{ backgroundColor: C.gold, width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.35 }}
                  />
                  <span
                    className="block font-bold leading-none mb-5 select-none"
                    style={{ fontSize: "52px", color: "rgba(255,215,0,0.15)", fontFamily: "'Roboto', Arial, sans-serif", lineHeight: 1 }}
                  >
                    {p.num}
                  </span>
                  <div className="mb-3" style={{ color: C.gold }}>{p.icon}</div>
                  <h3
                    className="font-semibold mb-3 transition-colors duration-300 group-hover:text-yellow-400"
                    style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", fontFamily: "'Roboto', Arial, sans-serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Roboto', Arial, sans-serif" }}>
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            4. FORM KONTAK — Linen, 2-col
        ══════════════════════════════════════════ */}
        <section className="py-24" style={{ backgroundColor: C.linen }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

              {/* LEFT — heading + context */}
              <motion.div
                variants={slideL} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Kirim Pesan
                </p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
                <h2
                  className="font-bold leading-tight mb-6"
                  style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Ceritakan Proyek<br />Anda.
                </h2>
                <p className="text-sm leading-relaxed mb-10" style={{ color: "#666", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Isi form di samping dan kami akan membalas dalam 1×24 jam kerja dengan proposal serta estimasi awal yang sesuai kebutuhan Anda.
                </p>

                <div className="pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <p className="text-xs mb-4" style={{ color: "#999", fontFamily: "'Roboto', Arial, sans-serif" }}>
                    Lebih suka chat langsung?
                  </p>
                  <a href={`https://wa.me/${contactSettings.whatsapp}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer">
                    <motion.button
                      whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }}
                      whileTap={{ scale: 0.97 }}
                      className="border font-semibold text-sm px-7 py-3 transition-all duration-300 flex items-center gap-2"
                      style={{ borderRadius: 0, borderColor: C.text, color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      WhatsApp <ArrowRight size={14} />
                    </motion.button>
                  </a>
                </div>
              </motion.div>

              {/* RIGHT — form */}
              <motion.div
                variants={slideR} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.15 }}
                className="relative"
              >
                {/* Success overlay */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-center"
                      style={{ backgroundColor: C.pearl, border: `1px solid rgba(255,215,0,0.2)` }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div
                        className="w-16 h-16 flex items-center justify-center mb-6"
                        style={{ border: `2px solid ${C.gold}`, color: C.gold }}
                      >
                        <CheckCircle2 size={28} />
                      </div>
                      <h3
                        className="font-bold mb-3"
                        style={{ fontSize: "1.4rem", fontFamily: "'Roboto', Arial, sans-serif", color: C.text }}
                      >
                        Pesan Terkirim!
                      </h3>
                      <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "#666", fontFamily: "'Roboto', Arial, sans-serif" }}>
                        Terima kasih telah menghubungi kami. Tim DIEGMA akan merespons dalam 1–2 hari kerja.
                      </p>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                        style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}
                      >
                        Tutup
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The form */}
                <div className="p-8 sm:p-10" style={{ backgroundColor: C.pearl, border: "1px solid rgba(0,0,0,0.07)" }}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                      {/* Nama */}
                      <FormField
                        control={form.control} name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                              Nama Lengkap
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nama Anda"
                                className="rounded-none border-x-0 border-t-0 border-b px-0 py-2 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-yellow-500"
                                style={{ fontFamily: "'Roboto', Arial, sans-serif", borderColor: "rgba(0,0,0,0.15)" }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Email + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control} name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email" placeholder="email@anda.com"
                                  className="rounded-none border-x-0 border-t-0 border-b px-0 py-2 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-yellow-500"
                                  style={{ fontFamily: "'Roboto', Arial, sans-serif", borderColor: "rgba(0,0,0,0.15)" }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control} name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                                Nomor HP
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel" placeholder="08xx xxxx xxxx"
                                  className="rounded-none border-x-0 border-t-0 border-b px-0 py-2 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-yellow-500"
                                  style={{ fontFamily: "'Roboto', Arial, sans-serif", borderColor: "rgba(0,0,0,0.15)" }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Jenis Proyek */}
                      <FormField
                        control={form.control} name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                              Jenis Proyek
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger
                                  className="rounded-none border-x-0 border-t-0 border-b px-0 py-2 bg-transparent text-sm focus:ring-0"
                                  style={{ fontFamily: "'Roboto', Arial, sans-serif", borderColor: "rgba(0,0,0,0.15)" }}
                                >
                                  <SelectValue placeholder="Pilih jenis proyek" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent style={{ borderRadius: 0, fontFamily: "'Roboto', Arial, sans-serif" }}>
                                <SelectItem value="residential">Residensial</SelectItem>
                                <SelectItem value="commercial">Komersial</SelectItem>
                                <SelectItem value="interior">Desain Interior</SelectItem>
                                <SelectItem value="konstruksi">Konstruksi & Renovasi</SelectItem>
                                <SelectItem value="furniture">Furniture Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Pesan */}
                      <FormField
                        control={form.control} name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#888", fontFamily: "'Roboto', Arial, sans-serif" }}>
                              Pesan
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Ceritakan kebutuhan proyek Anda secara singkat…"
                                className="rounded-none border-x-0 border-t-0 border-b px-0 py-2 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-yellow-500 resize-none"
                                style={{ fontFamily: "'Roboto', Arial, sans-serif", borderColor: "rgba(0,0,0,0.15)" }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Submit */}
                      <div className="pt-2">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={!isSubmitting ? { backgroundColor: "#111", color: "#fff" } : {}}
                          whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                          className="flex items-center gap-2 font-semibold text-sm px-8 py-3.5 transition-all duration-300"
                          style={{
                            borderRadius: 0,
                            backgroundColor: C.gold,
                            color: "#111",
                            fontFamily: "'Roboto', Arial, sans-serif",
                            opacity: isSubmitting ? 0.75 : 1,
                          }}
                        >
                          {isSubmitting ? (
                            <><Loader2 size={15} className="animate-spin" /> Mengirim…</>
                          ) : (
                            <>Kirim Pesan <Send size={14} /></>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </Form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            5. LOKASI / MAP — Pearl
        ══════════════════════════════════════════ */}
        <section className="py-24" style={{ backgroundColor: C.pearl }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

              {/* Left info */}
              <motion.div
                variants={slideL} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Temukan Kami
                </p>
                <div className="h-px w-8 mb-8" style={{ backgroundColor: C.gold }} />
                <h2
                  className="font-bold leading-tight mb-6"
                  style={{ fontSize: "clamp(1.6rem,2.5vw,2.2rem)", color: C.text, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Studio DIEGMA<br />— Kota Bekasi.
                </h2>
                <p className="text-sm leading-relaxed mb-2" style={{ color: "#555", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Jl. Anggrek Raya, Duren Jaya, Kec. Bekasi Timur
                </p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "#999", fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Kota Bekasi, 17111<br />Indonesia
                </p>
                <a
                  href="https://maps.app.goo.gl/gRWpz749rMP4DmNc9"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                  style={{ color: C.gold, fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Lihat di Google Maps <ArrowRight size={12} />
                </a>
              </motion.div>

              {/* Map */}
              <motion.div
                className="lg:col-span-2"
                variants={slideR} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.15 }}
              >
                <div className="w-full overflow-hidden h-[280px] sm:h-[360px] lg:h-[420px]" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                  <iframe
                    src={contactSettings.mapsUrl}
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="DIEGMA Studio Location"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            6. CTA — Dark, identik About & Layanan
        ══════════════════════════════════════════ */}
        <section className="py-24" style={{ backgroundColor: C.dark }}>
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="show"
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
                  Siap Wujudkan Ruang<br />Impian Anda?
                </h2>
                <p
                  className="text-sm leading-relaxed mb-10 mx-auto"
                  style={{ color: "rgba(255,255,255,0.45)", maxWidth: "400px", fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  Mulai konsultasi hari ini — kami jadwalkan pertemuan dan siapkan proposal terbaik untuk Anda.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href={`https://wa.me/${contactSettings.whatsapp}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer">
                    <motion.button
                      whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                      className="font-semibold text-sm px-8 py-3.5 flex items-center gap-2 transition-all duration-300"
                      style={{ borderRadius: 0, backgroundColor: C.gold, color: "#111", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Konsultasi via WhatsApp <ArrowRight size={14} />
                    </motion.button>
                  </a>
                  <a href="/services">
                    <motion.button
                      whileHover={{ backgroundColor: C.gold, borderColor: C.gold, color: "#111" }} whileTap={{ scale: 0.97 }}
                      className="border text-sm font-semibold px-8 py-3.5 transition-all duration-300 flex items-center gap-2"
                      style={{ borderRadius: 0, borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.75)", fontFamily: "'Roboto', Arial, sans-serif" }}
                    >
                      Lihat Layanan <ArrowRight size={14} />
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
