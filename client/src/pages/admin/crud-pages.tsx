import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query
} from "firebase/firestore";
import { Plus, Pencil, Trash2, X, ImageIcon, Loader2 } from "lucide-react";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "image-url";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

function CrudPage({
  title, collection: colName, fields, displayKey, imageKey,
}: {
  title: string; collection: string; fields: FieldConfig[];
  displayKey: string; imageKey?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm = () => Object.fromEntries(
    fields.map(f => [f.key, f.type === "select" ? f.options?.[0]?.value || "" : ""])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, colName), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setShowForm(true); };
  const openEdit = (item: any) => { setForm(item); setEditId(item.id); setShowForm(true); };

  const handleSave = async () => {
    const required = fields.filter(f => f.required);
    for (const f of required) {
      if (!form[f.key]) return alert(`${f.label} wajib diisi.`);
    }
    setSaving(true);
    try {
      const data = { ...form };
      delete data.id;
      if (editId) {
        await updateDoc(doc(db, colName, editId), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, colName), { ...data, createdAt: serverTimestamp() });
      }
      await fetchData(); setShowForm(false);
    } catch (e) { console.error(e); alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, colName, id));
      setDeleteId(null); fetchData();
    } catch (e) { alert("Gagal menghapus."); }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] transition-all";

  return (
    <ProtectedRoute>
      <AdminLayout title={title}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{items.length} item terdaftar</p>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 text-sm font-semibold hover:bg-[#FFD700]/90 transition-colors">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">Belum ada data. Klik Tambah untuk mulai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {imageKey && item[imageKey] && (
                  <img src={item[imageKey]} alt="" className="w-full h-40 object-cover"
                    onError={e => (e.currentTarget.style.display = "none")} />
                )}
                {imageKey && !item[imageKey] && (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">{item[displayKey]}</h3>
                  {fields.filter(f => f.key !== displayKey && f.key !== imageKey && f.type !== "textarea").slice(0, 2).map(f => (
                    <p key={f.key} className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item[f.key]}</p>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-xs text-gray-600 hover:border-[#FFD700] hover:text-black transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-xs text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg my-4">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-lg">{editId ? "Edit" : "Tambah"} {title}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {f.label}{f.required && " *"}
                    </label>
                    {f.type === "image-url" ? (
                      <div>
                        <input type="text" value={form[f.key] || ""}
                          onChange={e => setForm(fo => ({ ...fo, [f.key]: e.target.value }))}
                          placeholder="https://example.com/foto.jpg"
                          className={inputClass} />
                        <p className="text-xs text-gray-400 mt-1">Link URL foto dari internet</p>
                        {form[f.key] && (
                          <img src={form[f.key]} alt="preview"
                            className="mt-2 h-32 w-full object-cover border border-gray-200"
                            onError={e => (e.currentTarget.style.display = "none")} />
                        )}
                      </div>
                    ) : f.type === "textarea" ? (
                      <textarea value={form[f.key] || ""} rows={3}
                        onChange={e => setForm(fo => ({ ...fo, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className={`${inputClass} resize-none`} />
                    ) : f.type === "select" ? (
                      <select value={form[f.key] || ""}
                        onChange={e => setForm(fo => ({ ...fo, [f.key]: e.target.value }))}
                        className={inputClass}>
                        {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={form[f.key] || ""}
                        onChange={e => setForm(fo => ({ ...fo, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className={inputClass} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium hover:bg-gray-50">
                  Batal
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#FFD700] text-black text-sm font-bold hover:bg-[#FFD700]/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
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
              <h3 className="font-bold text-gray-900 mb-2">Yakin hapus?</h3>
              <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
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

// ==================== PAGES ====================
export function AdminLayanan() {
  return (
    <CrudPage title="Kelola Layanan" collection="layanan" displayKey="title" imageKey="image"
      fields={[
        { key: "image", label: "URL Foto Layanan", type: "image-url" },
        { key: "title", label: "Nama Layanan", type: "text", placeholder: "Desain Interior Rumah", required: true },
        { key: "category", label: "Kategori", type: "select", options: [
          { value: "interior-eksterior", label: "Desain Interior & Eksterior" },
          { value: "konstruksi", label: "Konstruksi" },
          { value: "furniture", label: "Furniture" },
        ]},
        { key: "description", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi layanan...", required: true },
        { key: "startPrice", label: "Harga Mulai", type: "text", placeholder: "Mulai dari Rp 10.000.000" },
      ]}
    />
  );
}

export function AdminTim() {
  return (
    <CrudPage title="Kelola Tim" collection="tim" displayKey="name" imageKey="image"
      fields={[
        { key: "image", label: "URL Foto", type: "image-url" },
        { key: "name", label: "Nama", type: "text", placeholder: "Nama lengkap", required: true },
        { key: "role", label: "Jabatan", type: "text", placeholder: "Principal Architect" },
        { key: "bio", label: "Bio", type: "textarea", placeholder: "Deskripsi singkat..." },
        { key: "instagram", label: "Instagram", type: "text", placeholder: "https://instagram.com/..." },
        { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "https://linkedin.com/in/..." },
      ]}
    />
  );
}

export function AdminProyek() {
  return (
    <CrudPage title="Kelola Proyek" collection="proyek" displayKey="title" imageKey="image"
      fields={[
        { key: "image", label: "URL Foto Proyek", type: "image-url" },
        { key: "title", label: "Judul Proyek", type: "text", placeholder: "Modern House Project", required: true },
        { key: "category", label: "Kategori", type: "select", options: [
          { value: "residential", label: "Residential" },
          { value: "commercial", label: "Commercial" },
          { value: "interior", label: "Interior" },
        ]},
        { key: "location", label: "Lokasi", type: "text", placeholder: "Jakarta Selatan" },
        { key: "year", label: "Tahun", type: "text", placeholder: "2024" },
        { key: "description", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi proyek..." },
      ]}
    />
  );
}