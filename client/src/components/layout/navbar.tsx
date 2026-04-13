import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Beranda",      href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Produk",       href: "/products" },
  { label: "Layanan",      href: "/services" },
  { label: "Kontak",       href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [location]                          = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // inisialisasi
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Saat mobile menu buka & tutup, lock scroll
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ── Gradient gelap — hanya tampil saat belum di-scroll ── */}
      {/* Memastikan teks terbaca di atas foto hero sebelum scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.35 }}
        style={{
          height: "140px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 70%, transparent 100%)",
        }}
      />

      {/* ── Navbar utama ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(17, 17, 17, 0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255, 215, 0, 0.12)"
            : "none",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.25)"
            : "none",
        }}
      >
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-[70px]">

            {/* Logo — PNG Image */}
            <Link href="/">
              <motion.div className="cursor-pointer select-none">
                <img
                  src="/logo.png"
                  alt="DIEGMA"
                  style={{
                    height: "28px",
                    width: "auto",
                    filter: scrolled
                      ? "brightness(0) invert(1)"
                      : "brightness(0) invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.4))",
                  }}
                />
              </motion.div>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item, i) => {
                const isActive = location === item.href;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                  >
                    <Link href={item.href}>
                      <span
                        className="relative cursor-pointer transition-all duration-200"
                        style={{
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          color: isActive ? "#FFD700" : "rgba(255,255,255,0.90)",
                          textShadow: scrolled
                            ? "none"
                            : "0 1px 6px rgba(0,0,0,0.45)",
                        }}
                        onMouseEnter={e => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.color = "#FFD700";
                        }}
                        onMouseLeave={e => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.90)";
                        }}
                      >
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="navbar-underline"
                            className="absolute left-0 w-full"
                            style={{
                              bottom: "-4px",
                              height: "1px",
                              backgroundColor: "#FFD700",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                          />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile — hamburger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-label="Toggle menu"
                className="w-9 h-9 flex items-center justify-center transition-colors duration-200"
                style={{ color: "#fff" }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu — solid dark */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              style={{
                backgroundColor: "rgba(17,17,17,0.97)",
                borderTop: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item, i) => {
                  const isActive = location === item.href;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span
                          className="block px-3 py-3 text-sm font-medium cursor-pointer transition-colors duration-200"
                          style={{
                            fontFamily: "'Roboto', Arial, sans-serif",
                            letterSpacing: "0.04em",
                            color: isActive ? "#FFD700" : "rgba(255,255,255,0.80)",
                            borderLeft: isActive
                              ? "2px solid #FFD700"
                              : "2px solid transparent",
                          }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
