import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Loader2, CheckCircle, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface AboutContent {
  headline: string;
  description1: string;
  description2: string;
  vision: string;
  mission: string;
  values: { title: string; description: string }[];
  aboutSectionImage: string;
  aboutStudioImage: string;
}

const defaultContent: AboutContent = {
  headline: "Studio Arsitektur & Desain Interior",
  description1: "DIEGMA adalah studio arsitektur dan desain interior yang berdedikasi untuk menciptakan ruang yang fungsional, estetis, dan bermakna. Kami percaya bahwa desain yang baik harus mencerminkan kebutuhan dan kepribadian klien kami.",
  description2: "Dengan tim yang terdiri dari para profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal hingga implementasi akhir.",
  vision: "Menjadi studio desain terkemuka yang mengubah ruang menjadi pengalaman hidup yang luar biasa.",
  mission: "Memberikan solusi desain terbaik yang memadukan estetika, fungsi, dan keberlanjutan untuk setiap klien.",
  values: [
    { title: "Inovasi",    description: "Selalu menghadirkan ide-ide segar dan solusi kreatif" },
    { title: "Kualitas",   description: "Berkomitmen pada standar tertinggi di setiap proyek" },
    { title: "Integritas", description: "Jujur dan transparan dalam setiap langkah proses" },
    { title: "Kolaborasi", description: "Bekerja bersama klien sebagai mitra sejati" },
  ],
  aboutSectionImage: "",
  aboutStudioImage: "",
};

type TabType = "konten" | "visi" | "nilai" | "gambar";

const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all";

export default function AdminTentangKami() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("konten");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "about"));
        if (snap.exists()) setContent({ ...defaultContent, ...snap.data() as AboutContent });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await setDoc(doc(db, "settings", "about"), content, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan. Coba lagi.");
    } finally { setSaving(false); }
  };

  const set = (key: keyof AboutContent, val: any) =>
    setContent(prev => ({ ...prev, [key]: val }));

  const updateValue = (index: number, field: "title" | "description", val: string) => {
    const updated = [...content.values];
    updated[index] = { ...updated[index], [field]: val };
    set("values", updated);
  };

  const addValue = () => set("values", [...content.values, { title: "", description: "" }]);
  const removeValue = (i: number) => set("values", content.values.filter((_, idx) => idx !== i));

  const tabs: { key: TabType; label: string }[] = [
    { key: "konten", label: "Teks Halaman"     },
    { key: "visi",   label: "Visi & Misi"      },
    { key: "nilai",  label: "Nilai Perusahaan" },
    { key: "gambar", label: "🖼 Gambar Halaman" },
  ];

  if (loading) return (
    <ProtectedRoute>
      <AdminLayout title="Tentang Kami">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <AdminLayout title="Tentang Kami">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === t.key ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Teks Halaman */}
        {activeTab === "konten" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Konten Halaman Tentang Kami</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul / Headline</label>
              <input value={content.headline} onChange={e => set("headline", e.target.value)}
                placeholder="Studio Arsitektur & Desain Interior" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraf 1</label>
              <textarea rows={4} value={content.description1} onChange={e => set("description1", e.target.value)}
                placeholder="Deskripsi utama perusahaan..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraf 2</label>
              <textarea rows={3} value={content.description2} onChange={e => set("description2", e.target.value)}
                placeholder="Paragraf kedua tentang perusahaan..." className={`${inputClass} resize-none`} />
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Visi & Misi */}
        {activeTab === "visi" && (
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h3 className="font-bold text-gray-900">Visi & Misi Perusahaan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Visi</label>
              <textarea rows={3} value={content.vision} onChange={e => set("vision", e.target.value)}
                placeholder="Visi perusahaan..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Misi</label>
              <textarea rows={3} value={content.mission} onChange={e => set("mission", e.target.value)}
                placeholder="Misi perusahaan..." className={`${inputClass} resize-none`} />
            </div>
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Nilai Perusahaan */}
        {activeTab === "nilai" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Nilai-Nilai Perusahaan</h3>
              <button onClick={addValue}
                className="flex items-center gap-2 text-sm bg-[#FFD700] text-black px-3 py-2 font-medium hover:bg-[#FFD700]/90 transition-colors">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
            {content.values.map((v, i) => (
              <div key={i} className="flex gap-3 items-start bg-gray-50 p-4">
                <div className="flex-1 space-y-2">
                  <input value={v.title} onChange={e => updateValue(i, "title", e.target.value)}
                    placeholder="Nama nilai (contoh: Inovasi)" className={inputClass} />
                  <input value={v.description} onChange={e => updateValue(i, "description", e.target.value)}
                    placeholder="Deskripsi singkat nilai ini..." className={inputClass} />
                </div>
                <button onClick={() => removeValue(i)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {content.values.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">Belum ada nilai. Klik Tambah.</p>
            )}
            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* Gambar Halaman */}
        {activeTab === "gambar" && (
          <div className="bg-white border border-gray-200 p-6 space-y-6">
            <h3 className="font-bold text-gray-900">Gambar Halaman Tentang Kami</h3>

            {/* Gambar 1: Section about di Beranda */}
            <div className="border border-gray-100 p-5 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">1. Gambar Section "Tentang Kami" di Beranda</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Gambar yang tampil di sebelah kanan teks "Tentang Studio Kami" pada halaman Beranda (Home).
                </p>
              </div>
              <input
                value={content.aboutSectionImage}
                onChange={e => set("aboutSectionImage", e.target.value)}
                placeholder="https://... URL gambar"
                className={inputClass}
              />
              {content.aboutSectionImage ? (
                <img src={content.aboutSectionImage} alt="preview"
                  className="w-full h-48 object-cover border border-gray-100 mt-2"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="border-2 border-dashed border-gray-200 h-36 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <p className="text-xs">Preview akan muncul di sini</p>
                </div>
              )}
            </div>

            {/* Gambar 2: Gambar studio di halaman About */}
            <div className="border border-gray-100 p-5 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">2. Gambar Studio di Halaman Tentang Kami</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Gambar yang tampil di sebelah kanan deskripsi studio pada halaman Tentang Kami.
                </p>
              </div>
              <input
                value={content.aboutStudioImage}
                onChange={e => set("aboutStudioImage", e.target.value)}
                placeholder="https://... URL gambar"
                className={inputClass}
              />
              {content.aboutStudioImage ? (
                <img src={content.aboutStudioImage} alt="preview"
                  className="w-full h-48 object-cover border border-gray-100 mt-2"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="border-2 border-dashed border-gray-200 h-36 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <p className="text-xs">Preview akan muncul di sini</p>
                </div>
              )}
            </div>

            <SaveButton saving={saving} saved={saved} onSave={handleSave} />
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