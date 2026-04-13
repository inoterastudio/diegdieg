import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Users, Trash2, Search, Phone, Mail, Clock, Loader2, Download, X } from "lucide-react";

interface Subscriber {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  createdAt?: any;
}

function formatDate(ts: any) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminSubscribers() {
  const [data, setData]         = useState<Subscriber[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Subscriber)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "subscribers", id));
      setDeleteId(null);
      fetchData();
    } catch { alert("Gagal menghapus data."); }
  };

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ["Nama", "Email", "No. WhatsApp", "Tanggal Daftar"],
      ...filtered.map(s => [s.nama, s.email, s.noHp, formatDate(s.createdAt)]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "diegma-subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = data.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.noHp.includes(search)
  );

  return (
    <ProtectedRoute>
      <AdminLayout title="Subscribers">

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Total Subscriber</p>
              <p className="text-xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#FFD700]" />
            <div>
              <p className="text-xs text-gray-500">Bulan Ini</p>
              <p className="text-xl font-bold text-gray-900">
                {data.filter(s => {
                  if (!s.createdAt) return false;
                  const d = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau no HP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FFD700] w-72"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Belum ada subscriber.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">No. WhatsApp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal Daftar</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{s.nama}</td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${s.email}`} className="text-gray-600 hover:text-[#FFD700] transition-colors flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {s.email}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`https://wa.me/${s.noHp.replace(/\D/g, "")}?text=Halo ${s.nama}, terima kasih sudah berlangganan newsletter DIEGMA!`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> {s.noHp}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(s.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hapus Subscriber?</h3>
              <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600">Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </ProtectedRoute>
  );
}