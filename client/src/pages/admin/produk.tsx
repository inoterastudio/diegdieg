import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query
} from "firebase/firestore";
import {
  Plus, Pencil, Trash2, X, ImageIcon, Loader2,
  Eye, EyeOff, Search, Package, Link as LinkIcon
} from "lucide-react";

const CATEGORIES = [
  { value: "interior", label: "Desain Interior & Eksterior" },
  { value: "konstruksi", label: "Konstruksi" },
  { value: "furniture", label: "Furniture" },
];

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
  createdAt?: any;
}

const emptyForm = (): Omit<Product, "id" | "createdAt"> => ({
  name: "", category: "interior", price: "",
  description: "", specs: "", features: "",
  imageUrl: "", visible: true,
});

const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all";

export default function AdminProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Coba pakai orderBy dulu; kalau gagal (index belum ada), fallback tanpa orderBy
      let snap;
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        snap = await getDocs(q);
      } catch {
        snap = await getDocs(collection(db, "products"));
      }
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      // Sort di client jika orderBy gagal
      items.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? 0;
        const tb = b.createdAt?.seconds ?? 0;
        return tb - ta;
      });
      setProducts(items);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditId(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, price: p.price, description: p.description,
      specs: p.specs, features: p.features, imageUrl: p.imageUrl, visible: p.visible });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert("Nama produk wajib diisi.");
    setSaving(true);
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan. Periksa koneksi Firebase.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setDeleteId(null); fetchProducts();
    } catch (e) { alert("Gagal menghapus."); }
  };

  const toggleVisible = async (p: Product) => {
    try {
      await updateDoc(doc(db, "products", p.id), { visible: !p.visible });
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, visible: !x.visible } : x));
    } catch (e) { console.error(e); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const getCatLabel = (val: string) => CATEGORIES.find(c => c.value === val)?.label || val;

  return (
    <ProtectedRoute>
      <AdminLayout title="Kelola Produk">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari produk..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] w-52" />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="py-2 px-3 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700]">
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 font-semibold text-sm hover:bg-[#FFD700]/90 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Tambah Produk
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Produk</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Kategori</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Harga</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{getCatLabel(p.category)}</td>
                      <td className="px-4 py-3 text-gray-700">{p.price || "-"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleVisible(p)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors ${
                            p.visible ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {p.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.visible ? "Tampil" : "Tersembunyi"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl my-4">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">{editId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {/* URL Gambar */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <LinkIcon className="w-4 h-4 text-gray-400" /> URL Foto Produk
                  </label>
                  <input value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://example.com/foto-produk.jpg"
                    className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">
                    Masukkan link URL foto dari Google Drive, Imgur, atau hosting gambar lainnya
                  </p>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="preview"
                      className="mt-2 h-36 w-full object-cover border border-gray-200"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Meja Kerja Minimalis" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className={inputClass}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Rp 5.000.000 atau Hubungi Kami" className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Deskripsi singkat produk..."
                    className={`${inputClass} resize-none`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spesifikasi</label>
                    <textarea rows={3} value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))}
                      placeholder={"Ukuran: 120x60x75 cm\nMaterial: Kayu Jati"}
                      className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitur / Keunggulan</label>
                    <textarea rows={3} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                      placeholder={"Anti rayap\nFinishing premium\nGaransi 1 tahun"}
                      className={`${inputClass} resize-none`} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="visible" checked={form.visible}
                    onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))}
                    className="w-4 h-4 accent-[#FFD700]" />
                  <label htmlFor="visible" className="text-sm text-gray-700">Tampilkan di website</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-[#FFD700] text-black px-4 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? "Menyimpan..." : "Simpan Produk"}
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
              <h3 className="font-bold text-gray-900 mb-2">Hapus Produk?</h3>
              <p className="text-sm text-gray-500 mb-6">Produk yang dihapus tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 bg-red-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-red-600">Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}