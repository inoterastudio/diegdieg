import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, updateDoc, deleteDoc,
  doc, orderBy, query, getDoc
} from "firebase/firestore";
import {
  MessageSquare, Trash2, Eye, EyeOff, Mail,
  Phone, Clock, Loader2, Search, CheckCheck, X
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

const DEFAULT_WA = "6281239243317";

function formatDate(ts: any) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminPesan() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [waNumber, setWaNumber] = useState(DEFAULT_WA);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Fetch WA number dari settings
    getDoc(doc(db, "settings", "main")).then(snap => {
      if (snap.exists() && snap.data().whatsapp) {
        setWaNumber(snap.data().whatsapp);
      }
    }).catch(() => {});
  }, []);

  const markRead = async (id: string, val: boolean) => {
    try {
      await updateDoc(doc(db, "messages", id), { read: val });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: val } : m));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: val } : prev);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      setDeleteId(null);
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus pesan.");
    }
  };

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.read) markRead(m.id, true);
  };

  const filtered = messages.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchRead =
      filterRead === "all" ||
      (filterRead === "unread" && !m.read) ||
      (filterRead === "read" && m.read);
    return matchSearch && matchRead;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <ProtectedRoute>
      <AdminLayout title="Pesan Masuk">
        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white border border-gray-200 px-4 py-3 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Total Pesan</p>
              <p className="text-xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#FFD700]" />
              <div>
                <p className="text-xs text-gray-500">Belum Dibaca</p>
                <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#FFD700] w-64"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterRead === f
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "all" ? "Semua" : f === "unread" ? "Belum Dibaca" : "Sudah Dibaca"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Tidak ada pesan.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map(m => (
                <div
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !m.read ? "bg-[#FFFBEA]" : ""
                  }`}
                >
                  <div className={`w-2 h-2 mt-2 flex-shrink-0 ${!m.read ? "bg-[#FFD700]" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-medium text-sm ${!m.read ? "text-gray-900" : "text-gray-600"}`}>
                        {m.name}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{m.email}</p>
                    {m.subject && <p className="text-xs font-medium text-gray-700 mb-1">{m.subject}</p>}
                    <p className="text-sm text-gray-500 line-clamp-2">{m.message}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); markRead(m.id, !m.read); }}
                      className={`p-1.5 transition-colors ${
                        m.read
                          ? "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                          : "text-[#FFD700] hover:bg-[#FFD700]/10"
                      }`}
                      title={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    >
                      {m.read ? <EyeOff className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteId(m.id); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Detail Pesan</h3>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Nama</p>
                    <p className="font-medium text-gray-900">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Waktu</p>
                    <p className="text-gray-700">{formatDate(selected.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <p className="text-gray-700 break-all">{selected.email}</p>
                  </div>
                  {selected.phone && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Telepon</p>
                      <p className="text-gray-700">{selected.phone}</p>
                    </div>
                  )}
                </div>
                {selected.subject && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Subjek</p>
                    <p className="font-medium text-gray-900">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-xs mb-1">Pesan</p>
                  <div className="bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Pertanyaan Anda"}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Balas Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=Halo ${selected.name}, terima kasih telah menghubungi DIEGMA.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Balas WhatsApp
                    </a>
                  )}
                </div>
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
              <h3 className="font-bold text-gray-900 mb-2">Hapus Pesan?</h3>
              <p className="text-sm text-gray-500 mb-6">Pesan yang dihapus tidak dapat dikembalikan.</p>
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