import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Clock, ArrowRight, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface SiteSettings {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  jamOperasional: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "6281239243317",
  phone: "+62 812-3924-3317",
  email: "info@diegma.com",
  address: "Bandung, Jawa Barat, Indonesia",
  instagram: "https://instagram.com/diegma",
  facebook: "https://facebook.com/diegma",
  linkedin: "https://linkedin.com/company/diegma",
  jamOperasional: "Senin - Jumat: 08.00 - 17.00 WIB",
};

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() as SiteSettings });
        }
      } catch (e) {
        console.error("Footer settings error:", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const formatWAMsg = (service: string): string =>
    encodeURIComponent(`Halo DIEGMA,\n\nSaya tertarik dengan layanan *${service}* yang Anda tawarkan.\n\nMohon informasi lebih lanjut.\n\nTerima kasih!`);

  return (
    <footer className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#111] pointer-events-none" />

      {/* Pre-footer CTA */}
      <div className="relative bg-[#FFD700] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0"
          >
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[#111] mb-3">
                Siap untuk mewujudkan proyek impian Anda?
              </h2>
              <p className="text-[#333] text-lg">
                Konsultasikan kebutuhan desain dan arsitektur Anda dengan tim profesional kami.
              </p>
            </div>
            <a href={`https://wa.me/${settings.whatsapp}?text=${formatWAMsg("Konsultasi Proyek")}`}
              target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-[#111] hover:bg-[#222] text-white py-4 px-8 flex items-center space-x-2"
              >
                <span className="font-medium">Hubungi Kami</span>
                <ArrowRight size={16} />
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative bg-transparent text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h3 className="text-2xl font-bold tracking-wider mb-8 text-white">DIEGMA</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Studio arsitektur dan desain interior premium yang berdedikasi untuk menciptakan ruang yang fungsional, estetis, dan bermakna bagi klien kami.
              </p>
              <div className="flex space-x-5">
                {settings.facebook && (
                  <motion.a whileHover={{ scale: 1.2 }} href={settings.facebook}
                    target="_blank" rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#FFD700] transition-all" aria-label="Facebook">
                    <Facebook size={20} />
                  </motion.a>
                )}
                {settings.instagram && (
                  <motion.a whileHover={{ scale: 1.2 }} href={settings.instagram}
                    target="_blank" rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#FFD700] transition-all" aria-label="Instagram">
                    <Instagram size={20} />
                  </motion.a>
                )}
                {settings.linkedin && (
                  <motion.a whileHover={{ scale: 1.2 }} href={settings.linkedin}
                    target="_blank" rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#FFD700] transition-all" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </motion.a>
                )}
              </div>
            </motion.div>

            {/* Navigasi */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="text-xl font-bold mb-8 text-white relative">
                <span className="after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-[#FFD700]">Navigasi</span>
              </h3>
              <ul className="space-y-5">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Tentang Kami", href: "/about" },
                  { label: "Layanan", href: "/services" },
                  { label: "Produk", href: "/products" },
                  { label: "Kontak", href: "/contact" },
                ].map((item) => (
                  <motion.li key={item.label} whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Link href={item.href} className="flex items-center text-gray-300 hover:text-[#FFD700] transition-colors">
                      <ArrowRight size={14} className="mr-2" />
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Layanan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 className="text-xl font-bold mb-8 text-white relative">
                <span className="after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-[#FFD700]">Layanan</span>
              </h3>
              <ul className="space-y-5">
                {[
                  { label: "Desain Interior", inquiry: "Desain Interior" },
                  { label: "Desain Eksterior", inquiry: "Desain Eksterior" },
                  { label: "Konstruksi", inquiry: "Konstruksi" },
                  { label: "Desain Furniture", inquiry: "Desain Furniture" },
                  { label: "Konsultasi", inquiry: "Konsultasi Umum" },
                ].map((item) => (
                  <motion.li key={item.label} whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <a href={`https://wa.me/${settings.whatsapp}?text=${formatWAMsg(item.inquiry)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-[#FFD700] transition-colors">
                      <ArrowRight size={14} className="mr-2" />
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Kontak — dari Firebase */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h3 className="text-xl font-bold mb-8 text-white relative">
                <span className="after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-[#FFD700]">Kontak</span>
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="mr-4 p-2 bg-[#222] group-hover:bg-[#FFD700] transition-colors flex-shrink-0">
                    <MapPin className="text-[#FFD700] group-hover:text-[#111] transition-colors" size={18} />
                  </div>
                  <span className="text-gray-300 pt-1">{settings.address}</span>
                </li>
                <li className="flex items-center group">
                  <div className="mr-4 p-2 bg-[#222] group-hover:bg-[#FFD700] transition-colors flex-shrink-0">
                    <Phone className="text-[#FFD700] group-hover:text-[#111] transition-colors" size={18} />
                  </div>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#FFD700] transition-colors">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center group">
                  <div className="mr-4 p-2 bg-[#222] group-hover:bg-[#FFD700] transition-colors flex-shrink-0">
                    <Mail className="text-[#FFD700] group-hover:text-[#111] transition-colors" size={18} />
                  </div>
                  <a href={`mailto:${settings.email}`}
                    className="text-gray-300 hover:text-[#FFD700] transition-colors">
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-start group">
                  <div className="mr-4 p-2 bg-[#222] group-hover:bg-[#FFD700] transition-colors flex-shrink-0">
                    <Clock className="text-[#FFD700] group-hover:text-[#111] transition-colors" size={18} />
                  </div>
                  <span className="text-gray-300 pt-1">{settings.jamOperasional}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DIEGMA. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="/kebijakan-privasi" className="hover:text-[#FFD700] transition-colors">Kebijakan Privasi</a>
              <span className="text-gray-700">|</span>
              <a href="/syarat-ketentuan" className="hover:text-[#FFD700] transition-colors">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8, y: showScrollTop ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-[#FFD700] text-[#111] z-50 hover:bg-[#111] hover:text-[#FFD700] transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
}
