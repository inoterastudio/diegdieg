import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query, setDoc, getDoc
} from "firebase/firestore";
import {
  Plus, Pencil, Trash2, X, ImageIcon, Loader2, Save, CheckCircle, Link as LinkIcon
} from "lucide-react";

const CATEGORIES = [
  { value: "interior-eksterior", label: "Desain Interior & Eksterior" },
  { value: "konstruksi",         label: "Konstruksi" },
  { value: "furniture",          label: "Furniture" },
];

interface LayananItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  startPrice: string;
}

interface CategoryImages {
  "interior-eksterior": string;
  "konstruksi": string;
  "furniture": string;
}

const DEFAULT_CAT_IMAGES: CategoryImages = {
  "interior-eksterior": "",
  "konstruksi": "",
  "furniture": "",
};

const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all";

type ActiveTab = "items" | "gambar-utama";

export default function AdminLayanan() {
  const [items, setItems] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("items");
  const [catImages, setCatImages] = useState<CategoryImages>(DEFAULT_CAT_IMAGES);
  const [catSaving, setCatSaving] = useState(false);
  const [catSaved, setCatSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "interior-eksterior", description: "", image: "", startPrice: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      let snap;
      try {
        const q = query(collection(db, "layanan"), orderBy("createdAt", "desc"));
        snap = await getDocs(q);
      } catch {
        snap = await getDocs(collection(db, "layanan"));
      }
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as LayananItem));
      items.sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setItems(items);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchCatImages = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "layanan-images"));
      if (snap.exists()) setCatImages({ ...DEFAULT_CAT_IMAGES, ...snap.data() as CategoryImages });
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchItems(); fetchCatImages(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ title: "", category: "interior-eksterior", description: "", image: "", startPrice: "" });
    setShowForm(true);
  };

  const openEdit = (item: LayananItem) => {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, description: item.description, image: item.image, startPrice: item.startPrice });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return alert("Nama layanan wajib diisi.");
    setSaving(true);
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editId) {
        await updateDoc(doc(db, "layanan", editId), data);
      } else {
        await addDoc(collection(db, "layanan"), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false); fetchItems();
    } catch (e) { console.error(e); alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "layanan", id));
      setDeleteId(null); fetchItems();
    } catch (e) { alert("Gagal menghapus."); }
  };

  const handleSaveCatImages = async () => {
    setCatSaving(true); setCatSaved(false);
    try {
      await setDoc(doc(db, "settings", "layanan-images"), catImages, { merge: true });
      setCatSaved(true); setTimeout(() => setCatSaved(false), 3000);
    } catch (e) { console.error(e); alert("Gagal menyimpan."); }
    finally { setCatSaving(false); }
  };

  const getCatLabel = (val: string) => CATEGORIES.find(c => c.value === val)?.label || val;

  return (
    <ProtectedRoute>
      <AdminLayout title="Kelola Layanan">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "items", label: "Daftar Layanan" },
            { key: "gambar-utama", label: "🖼 Gambar Utama Kategori" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as ActiveTab)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === t.key ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== TAB: DAFTAR LAYANAN ===== */}
        {activeTab === "items" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{items.length} layanan terdaftar</p>
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 text-sm font-semibold hover:bg-[#FFD700]/90 transition-colors">
                <Plus className="w-4 h-4" /> Tambah Layanan
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" /></div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Belum ada layanan. Klik "Tambah Layanan" untuk mulai.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-[#B8860B] font-medium">{getCatLabel(item.category)}</span>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 mb-2 line-clamp-2">{item.title}</h3>
                      {item.startPrice && (
                        <p className="text-xs text-gray-500 mb-3">Rp {Number(String(item.startPrice).replace(/\D/g, "")).toLocaleString("id-ID")}</p>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-xs text-gray-600 hover:border-[#FFD700] hover:text-black transition-colors">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setDeleteId(item.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-xs text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== TAB: GAMBAR UTAMA KATEGORI ===== */}
        {activeTab === "gambar-utama" && (
          <div className="bg-white border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Gambar Utama per Kategori</h3>
              <p className="text-sm text-gray-500">
                Gambar besar yang tampil di halaman Layanan sebagai ilustrasi utama setiap kategori. Terpisah dari gambar item layanan.
              </p>
            </div>

            {CATEGORIES.map(cat => (
              <div key={cat.value} className="border border-gray-100 p-5 space-y-3">
                <p className="text-sm font-semibold text-gray-800">{cat.label}</p>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    value={catImages[cat.value as keyof CategoryImages] || ""}
                    onChange={e => setCatImages(prev => ({ ...prev, [cat.value]: e.target.value }))}
                    placeholder="https://... URL gambar utama kategori ini"
                    className={inputClass}
                  />
                </div>
                {catImages[cat.value as keyof CategoryImages] && (
                  <img
                    src={catImages[cat.value as keyof CategoryImages]}
                    alt={cat.label}
                    className="w-full h-44 object-cover border border-gray-100"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
            ))}

            <div className="flex items-center gap-4 pt-2">
              <button onClick={handleSaveCatImages} disabled={catSaving}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 disabled:opacity-60 transition-colors">
                {catSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {catSaving ? "Menyimpan..." : "Simpan Gambar Utama"}
              </button>
              {catSaved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Tersimpan!
                </span>
              )}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg my-4">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">{editId ? "Edit Layanan" : "Tambah Layanan Baru"}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Foto Layanan</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://..." className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">Foto ini tampil di kartu layanan (bukan gambar utama kategori)</p>
                  {form.image && (
                    <img src={form.image} alt="preview"
                      className="mt-2 h-32 w-full object-cover border border-gray-200"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Desain Interior Rumah" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className={inputClass}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Deskripsi singkat layanan..."
                    className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Mulai</label>
                  <input value={form.startPrice} onChange={e => setForm(f => ({ ...f, startPrice: e.target.value }))}
                    placeholder="10000000" className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">Isi angka saja, contoh: 10000000</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-[#FFD700] text-black px-4 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? "Menyimpan..." : "Simpan Layanan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 w-full max-w-sm text-center">
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hapus Layanan?</h3>
              <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-red-600">Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}