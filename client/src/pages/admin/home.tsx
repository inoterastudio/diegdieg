import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Save, Loader2, CheckCircle, Type, BarChart3, Image as ImageIcon, Layout, Plus, Trash2 } from "lucide-react";

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  statProyek: string;
  statTahun: string;
  statKlien: string;
  statKepuasan: string;
  aboutTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
}

interface ProyekItem {
  id?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
}

const defaultContent: HomeContent = {
  heroTitle: "Di Mana Keahlian\nBertemu Keindahan.",
  heroSubtitle: "Kami percaya bahwa desain yang baik harus mencerminkan kepribadian klien, sambil memperhatikan konteks lingkungan dan budaya.",
  heroButtonText: "Konsultasi Sekarang",
  heroImage: "",
  statProyek: "250",
  statTahun: "27",
  statKlien: "150",
  statKepuasan: "98",
  aboutTitle: "Tentang Studio Kami",
  aboutDesc1: "Di DIEGMA, kami percaya desain harus lebih dari sekadar mengisi ruang — ia harus bercerita. Lahir dari kecintaan mendalam terhadap material alami dan keahlian sejati, setiap karya kami dirancang untuk memadukan kehangatan, fungsi, dan keindahan abadi.",
  aboutDesc2: "Dengan tim profesional berpengalaman, kami menawarkan solusi desain komprehensif — mulai dari konsep awal, perencanaan ruang, hingga implementasi akhir yang melampaui ekspektasi.",
};

const defaultProyek: ProyekItem = { title: "", category: "Residential", location: "", year: new Date().getFullYear().toString(), image: "" };

type TabType = "hero" | "gambar-hero" | "stats" | "about" | "portofolio";

const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all";

export default function AdminHalamanHome() {
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // Portofolio states
  const [proyekList, setProyekList] = useState<ProyekItem[]>([]);
  const [proyekLoading, setProyekLoading] = useState(false);
  const [proyekSaving, setProyekSaving] = useState<string | null>(null);
  const [proyekSaved, setProyekSaved] = useState<string | null>(null);
  const [newProyek, setNewProyek] = useState<ProyekItem>(defaultProyek);
  const [addingProyek, setAddingProyek] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) setContent({ ...defaultContent, ...snap.data() as HomeContent });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeTab === "portofolio") loadProyek();
  }, [activeTab]);

  const loadProyek = async () => {
    setProyekLoading(true);
    try {
      const snap = await getDocs(collection(db, "proyek"));
      setProyekList(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProyekItem)));
    } catch (e) { console.error(e); }
    finally { setProyekLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await setDoc(doc(db, "settings", "main"), content, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan. Coba lagi.");
    } finally { setSaving(false); }
  };

  const handleSaveProyek = async (item: ProyekItem) => {
    if (!item.id) return;
    setProyekSaving(item.id);
    try {
      const { id, ...data } = item;
      await updateDoc(doc(db, "proyek", id!), data);
      setProyekSaved(item.id);
      setTimeout(() => setProyekSaved(null), 2500);
    } catch (e) { console.error(e); alert("Gagal menyimpan."); }
    finally { setProyekSaving(null); }
  };

  const handleDeleteProyek = async (id: string) => {
    if (!confirm("Hapus item portofolio ini?")) return;
    try {
      await deleteDoc(doc(db, "proyek", id));
      setProyekList(prev => prev.filter(p => p.id !== id));
    } catch (e) { console.error(e); alert("Gagal menghapus."); }
  };

  const handleAddProyek = async () => {
    if (!newProyek.title.trim()) return alert("Judul proyek wajib diisi.");
    setAddingProyek(true);
    try {
      const docRef = await addDoc(collection(db, "proyek"), { ...newProyek, createdAt: serverTimestamp() });
      setProyekList(prev => [...prev, { ...newProyek, id: docRef.id }]);
      setNewProyek(defaultProyek);
      setShowAddForm(false);
    } catch (e) { console.error(e); alert("Gagal menambah."); }
    finally { setAddingProyek(false); }
  };

  const updateProyekField = (id: string, key: keyof ProyekItem, val: string) => {
    setProyekList(prev => prev.map(p => p.id === id ? { ...p, [key]: val } : p));
  };

  const set = (key: keyof HomeContent, val: string) =>
    setContent(prev => ({ ...prev, [key]: val }));

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: "hero",        label: "Section Hero",        icon: Type      },
    { key: "gambar-hero", label: "Gambar Hero",          icon: ImageIcon },
    { key: "stats",       label: "Angka Statistik",      icon: BarChart3 },
    { key: "about",       label: "Preview Tentang Kami", icon: Type      },
    { key: "portofolio",  label: "Portofolio",           icon: Layout    },
  ];

  if (loading) return (
    <ProtectedRoute>
      <AdminLayout title="Halaman Home">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <AdminLayout title="Halaman Home">
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

        {/* Section Hero */}
        {activeTab === "hero" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Konten Section Hero</h3>
            <p className="text-sm text-gray-500">Bagian pertama yang dilihat pengunjung ketika membuka website.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Utama (Hero Title)</label>
              <textarea rows={3} value={content.heroTitle} onChange={e => set("heroTitle", e.target.value)}
                placeholder="Judul besar halaman utama..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjudul / Deskripsi</label>
              <textarea rows={3} value={content.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)}
                placeholder="Deskripsi singkat di bawah judul..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teks Tombol CTA</label>
              <input value={content.heroButtonText} onChange={e => set("heroButtonText", e.target.value)}
                placeholder="Konsultasi Sekarang" className={inputClass} />
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Gambar Hero */}
        {activeTab === "gambar-hero" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Gambar Hero</h3>
            <p className="text-sm text-gray-500">
              Gambar besar yang tampil di halaman Beranda. Masukkan URL gambar dari internet (ImgBB, Unsplash, dll).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar Hero</label>
              <input value={content.heroImage} onChange={e => set("heroImage", e.target.value)}
                placeholder="https://i.ibb.co/..."
                className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">
                Rekomendasi: upload ke <strong>imgbb.com</strong> → copy Direct Link. Rasio ideal: landscape 16:9.
              </p>
            </div>
            {content.heroImage ? (
              <div className="overflow-hidden border border-gray-200">
                <img src={content.heroImage} alt="Hero preview"
                  className="w-full h-64 object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 h-48 flex flex-col items-center justify-center text-gray-300 gap-2">
                <ImageIcon className="w-10 h-10" />
                <p className="text-sm">Preview gambar akan muncul di sini</p>
              </div>
            )}
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Angka Statistik */}
        {activeTab === "stats" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Angka Statistik</h3>
            <p className="text-sm text-gray-500">Angka-angka pencapaian yang tampil di halaman utama. Isi angka saja tanpa simbol.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Proyek</label>
                <input type="number" value={content.statProyek} onChange={e => set("statProyek", e.target.value)}
                  placeholder="250" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Tampil sebagai: 250+</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Pengalaman</label>
                <input type="number" value={content.statTahun} onChange={e => set("statTahun", e.target.value)}
                  placeholder="27" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Tampil sebagai: 27+</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Klien</label>
                <input type="number" value={content.statKlien} onChange={e => set("statKlien", e.target.value)}
                  placeholder="150" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Tampil sebagai: 150+</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tingkat Kepuasan (%)</label>
                <input type="number" value={content.statKepuasan} onChange={e => set("statKepuasan", e.target.value)}
                  placeholder="98" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Tampil sebagai: 98%</p>
              </div>
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Preview Tentang Kami di Home */}
        {activeTab === "about" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Section "Tentang Studio Kami" di Beranda</h3>
            <p className="text-sm text-gray-500">Teks preview tentang studio yang tampil di halaman utama.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Section</label>
              <input value={content.aboutTitle} onChange={e => set("aboutTitle", e.target.value)}
                placeholder="Tentang Studio Kami" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraf 1</label>
              <textarea rows={3} value={content.aboutDesc1} onChange={e => set("aboutDesc1", e.target.value)}
                placeholder="Deskripsi singkat studio..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraf 2</label>
              <textarea rows={3} value={content.aboutDesc2} onChange={e => set("aboutDesc2", e.target.value)}
                placeholder="Paragraf kedua..." className={`${inputClass} resize-none`} />
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Portofolio */}
        {activeTab === "portofolio" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Portofolio / Proyek</h3>
                <button onClick={() => setShowAddForm(v => !v)}
                  className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Tambah Proyek
                </button>
              </div>
              <p className="text-sm text-gray-500">Item-item yang tampil di section Portofolio DIEGMA di halaman utama. 3 item pertama yang tampil di beranda.</p>
            </div>

            {/* Form tambah baru */}
            {showAddForm && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 space-y-4">
                <h4 className="font-semibold text-gray-800">Tambah Proyek Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Proyek *</label>
                    <input value={newProyek.title} onChange={e => setNewProyek(p => ({ ...p, title: e.target.value }))}
                      placeholder="Villa Modern Bandung" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select value={newProyek.category} onChange={e => setNewProyek(p => ({ ...p, category: e.target.value }))}
                      className={inputClass}>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Interior</option>
                      <option>Exterior</option>
                      <option>Renovation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <input value={newProyek.location} onChange={e => setNewProyek(p => ({ ...p, location: e.target.value }))}
                      placeholder="Bandung" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <input value={newProyek.year} onChange={e => setNewProyek(p => ({ ...p, year: e.target.value }))}
                      placeholder="2024" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                  <input value={newProyek.image} onChange={e => setNewProyek(p => ({ ...p, image: e.target.value }))}
                    placeholder="https://i.ibb.co/..." className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">Upload ke imgbb.com → copy Direct Link</p>
                </div>
                {newProyek.image && (
                  <div className="overflow-hidden border border-gray-200 w-48 h-32">
                    <img src={newProyek.image} alt="preview" className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleAddProyek} disabled={addingProyek}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-60">
                    {addingProyek ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {addingProyek ? "Menyimpan..." : "Simpan Proyek"}
                  </button>
                  <button onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* List proyek */}
            {proyekLoading ? (
              <div className="flex items-center justify-center h-40 bg-white border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" />
              </div>
            ) : proyekList.length === 0 ? (
              <div className="bg-white border border-gray-200 p-10 text-center text-gray-400">
                <Layout className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Belum ada proyek. Klik "Tambah Proyek" untuk menambahkan.</p>
              </div>
            ) : (
              proyekList.map((item, idx) => (
                <div key={item.id} className="bg-white border border-gray-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFD700] tracking-widest">PROYEK {String(idx + 1).padStart(2, "0")}</span>
                    <button onClick={() => handleDeleteProyek(item.id!)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors border border-red-200 hover:border-red-400 px-3 py-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Proyek</label>
                      <input value={item.title} onChange={e => updateProyekField(item.id!, "title", e.target.value)}
                        placeholder="Villa Modern Bandung" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <select value={item.category} onChange={e => updateProyekField(item.id!, "category", e.target.value)}
                        className={inputClass}>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Interior</option>
                        <option>Exterior</option>
                        <option>Renovation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                      <input value={item.location} onChange={e => updateProyekField(item.id!, "location", e.target.value)}
                        placeholder="Bandung" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                      <input value={item.year} onChange={e => updateProyekField(item.id!, "year", e.target.value)}
                        placeholder="2024" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                    <input value={item.image} onChange={e => updateProyekField(item.id!, "image", e.target.value)}
                      placeholder="https://i.ibb.co/..." className={inputClass} />
                  </div>
                  {item.image && (
                    <div className="overflow-hidden border border-gray-200 w-48 h-32">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-1">
                    <button onClick={() => handleSaveProyek(item)} disabled={proyekSaving === item.id}
                      className="flex items-center gap-2 bg-[#FFD700] text-black px-5 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60">
                      {proyekSaving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {proyekSaving === item.id ? "Menyimpan..." : "Simpan"}
                    </button>
                    {proyekSaved === item.id && (
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Tersimpan!
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
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
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Tersimpan!
        </span>
      )}
    </div>
  );
}
