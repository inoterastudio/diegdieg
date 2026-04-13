import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {
  Phone, Mail, MapPin, Instagram, Facebook, Linkedin,
  Globe, MessageSquare, Save, Loader2, CheckCircle,
  KeyRound, Eye, EyeOff, Map, Info, Image as ImageIcon
} from "lucide-react";
import { Link } from "wouter";

interface Settings {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  website: string;
  jamOperasional: string;
  mapsUrl: string;
}

// Maps default → Bandung, Jawa Barat
const DEFAULT_MAPS = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.54532584253!2d107.5539486!3d-6.9034443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64c5e8866cd%3A0x374559f3a4b6c4a5!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid";

const defaultSettings: Settings = {
  whatsapp: "6281239243317",
  phone: "+62 812-3924-3317",
  email: "info@diegma.com",
  address: "Bandung, Jawa Barat, Indonesia",
  instagram: "",
  facebook: "",
  linkedin: "",
  website: "https://diegma.com",
  jamOperasional: "Senin - Jumat: 08.00 - 17.00 WIB",
  mapsUrl: DEFAULT_MAPS,
};

type TabType = "kontak" | "maps" | "hero-images" | "password";

const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all";

export default function AdminPengaturan() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("kontak");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passError, setPassError] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [heroPages, setHeroPages] = useState({
    tentangHeroImage: "",
    produkHeroImage: "",
    layananHeroImage: "",
    kontakHeroImage: "",
  });
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [mainSnap, pagesSnap] = await Promise.all([
          getDoc(doc(db, "settings", "main")),
          getDoc(doc(db, "settings", "pages")),
        ]);
        if (mainSnap.exists()) setSettings({ ...defaultSettings, ...mainSnap.data() as Settings });
        if (pagesSnap.exists()) setHeroPages(prev => ({ ...prev, ...pagesSnap.data() }));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await setDoc(doc(db, "settings", "main"), settings, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan pengaturan.");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (newPass !== confirmPass) { setPassError("Password baru tidak cocok."); return; }
    if (newPass.length < 6) { setPassError("Password minimal 6 karakter."); return; }
    setPassLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Tidak ada user aktif");
      const cred = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);
      setPassSaved(true);
      setOldPass(""); setNewPass(""); setConfirmPass("");
      setTimeout(() => setPassSaved(false), 3000);
    } catch (e: any) {
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
        setPassError("Password lama salah.");
      } else {
        setPassError("Gagal mengganti password. Coba lagi.");
      }
    } finally { setPassLoading(false); }
  };

  const handleSaveHeroImages = async () => {
    setHeroSaving(true); setHeroSaved(false);
    try {
      await setDoc(doc(db, "settings", "pages"), heroPages, { merge: true });
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan gambar hero.");
    } finally { setHeroSaving(false); }
  };

  const set = (key: keyof Settings, val: string) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: "kontak",       label: "Kontak & Sosmed",  icon: Phone      },
    { key: "maps",         label: "Google Maps",       icon: Map        },
    { key: "hero-images",  label: "Gambar Hero Halaman", icon: ImageIcon },
    { key: "password",     label: "Ganti Password",    icon: KeyRound   },
  ];

  if (loading) return (
    <ProtectedRoute>
      <AdminLayout title="Pengaturan">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <AdminLayout title="Pengaturan">

        {/* Info panel */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 px-5 py-4 mb-6">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Untuk mengubah <strong>teks Hero</strong>, <strong>angka Statistik</strong>, dan <strong>gambar beranda</strong>, gunakan menu{" "}
            <Link href="/diegma-panel/home">
              <span className="font-bold underline cursor-pointer hover:text-blue-900">Halaman Home</span>
            </Link>.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === t.key ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Kontak & Sosmed */}
        {activeTab === "kontak" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900 mb-2">Informasi Kontak</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-green-500" /> Nomor WhatsApp
                </label>
                <input value={settings.whatsapp} onChange={e => set("whatsapp", e.target.value)}
                  placeholder="628xxxx" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Format: 628xxxxxxxxxx (tanpa + atau spasi)</p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="w-4 h-4 text-gray-400" /> Nomor Telepon
                </label>
                <input value={settings.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="+62 812-xxxx-xxxx" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4 text-gray-400" /> Email
                </label>
                <input type="email" value={settings.email} onChange={e => set("email", e.target.value)}
                  placeholder="info@diegma.com" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Globe className="w-4 h-4 text-gray-400" /> Website
                </label>
                <input value={settings.website} onChange={e => set("website", e.target.value)}
                  placeholder="https://diegma.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4 text-gray-400" /> Alamat
              </label>
              <textarea rows={2} value={settings.address} onChange={e => set("address", e.target.value)}
                placeholder="Alamat lengkap kantor..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam Operasional</label>
              <input value={settings.jamOperasional} onChange={e => set("jamOperasional", e.target.value)}
                placeholder="Senin - Jumat: 08.00 - 17.00 WIB" className={inputClass} />
            </div>
            <hr className="border-gray-100" />
            <h3 className="font-bold text-gray-900">Media Sosial</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                </label>
                <input value={settings.instagram} onChange={e => set("instagram", e.target.value)}
                  placeholder="https://instagram.com/diegma" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Facebook className="w-4 h-4 text-blue-500" /> Facebook
                </label>
                <input value={settings.facebook} onChange={e => set("facebook", e.target.value)}
                  placeholder="https://facebook.com/diegma" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                </label>
                <input value={settings.linkedin} onChange={e => set("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/diegma" className={inputClass} />
              </div>
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Google Maps */}
        {activeTab === "maps" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Google Maps</h3>
            <p className="text-sm text-gray-500">
              Ubah lokasi peta yang tampil di halaman Kontak. Salin URL embed dari Google Maps.
            </p>
            <div className="bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">📌 Cara mendapatkan URL Embed Maps:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                <li>Buka <strong>Google Maps</strong> di browser</li>
                <li>Cari lokasi kantor Anda, lalu klik lokasinya</li>
                <li>Klik tombol <strong>Bagikan</strong> (ikon share)</li>
                <li>Pilih tab <strong>"Sematkan peta"</strong></li>
                <li>Klik <strong>"Salin HTML"</strong></li>
                <li>Dari HTML yang tersalin, ambil bagian <code className="bg-blue-100 px-1">src="https://..."</code> saja</li>
                <li>Paste URL tersebut di kolom di bawah</li>
              </ol>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Embed Google Maps</label>
              <textarea
                rows={4}
                value={settings.mapsUrl}
                onChange={e => set("mapsUrl", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className={`${inputClass} resize-none font-mono text-xs`}
              />
              <p className="text-xs text-gray-400 mt-1">Pastikan URL dimulai dengan: https://www.google.com/maps/embed</p>
            </div>
            {settings.mapsUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview Peta:</p>
                <div className="overflow-hidden border border-gray-200 h-64">
                  <iframe
                    src={settings.mapsUrl}
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Maps Preview"
                  />
                </div>
              </div>
            )}
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Gambar Hero Halaman */}
        {activeTab === "hero-images" && (
          <div className="bg-white border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Gambar Hero Halaman</h3>
              <p className="text-sm text-gray-500">Atur gambar latar belakang di bagian atas setiap halaman. Gunakan URL direct link (ImgBB, Cloudinary, dll).</p>
            </div>
            {[
              { key: "tentangHeroImage",  label: "Halaman Tentang Kami",  placeholder: "https://..." },
              { key: "produkHeroImage",   label: "Halaman Produk",         placeholder: "https://..." },
              { key: "layananHeroImage",  label: "Halaman Layanan",        placeholder: "https://..." },
              { key: "kontakHeroImage",   label: "Halaman Kontak",         placeholder: "https://..." },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  value={heroPages[field.key as keyof typeof heroPages]}
                  onChange={e => setHeroPages(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
                {heroPages[field.key as keyof typeof heroPages] && (
                  <div className="mt-2 relative overflow-hidden" style={{ height: "120px" }}>
                    <img
                      src={heroPages[field.key as keyof typeof heroPages]}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <button onClick={handleSaveHeroImages} disabled={heroSaving}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60">
                {heroSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {heroSaving ? "Menyimpan..." : "Simpan Gambar Hero"}
              </button>
              {heroSaved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Tersimpan!
                </span>
              )}
            </div>
          </div>
        )}

        {/* Ganti Password */}
        {activeTab === "password" && (
          <div className="bg-white border border-gray-200 p-6 max-w-md">
            <h3 className="font-bold text-gray-900 mb-5">Ganti Password Admin</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Lama</label>
                <div className="relative">
                  <input type={showOld ? "text" : "password"} value={oldPass}
                    onChange={e => setOldPass(e.target.value)} required
                    placeholder="••••••••" className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPass}
                    onChange={e => setNewPass(e.target.value)} required
                    placeholder="Min. 6 karakter" className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                  required placeholder="Ulangi password baru" className={inputClass} />
              </div>
              {passError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">{passError}</div>
              )}
              {passSaved && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Password berhasil diubah!
                </div>
              )}
              <button type="submit" disabled={passLoading}
                className="w-full bg-black text-white px-4 py-2.5 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {passLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {passLoading ? "Mengubah..." : "Ubah Password"}
              </button>
            </form>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

function SaveButton({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Tersimpan!
        </span>
      )}
    </div>
  );
}
