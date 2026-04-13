import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Package, Briefcase, MessageSquare, Users, ArrowRight, Database, CheckCircle2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { runSeeder, SeederProgress } from "@/lib/seeder";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, services: 0, subscribers: 0, messages: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Seeder states
  const [showSeeder, setShowSeeder] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedError, setSeedError] = useState("");
  const [forceOverwrite, setForceOverwrite] = useState(false);
  const [progress, setProgress] = useState<SeederProgress | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodSnap, svcSnap, subSnap, msgSnap] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "subscribers")),
        getDocs(collection(db, "messages")),
      ]);
      setStats({
        products: prodSnap.size,
        services: svcSnap.size,
        subscribers: subSnap.size,
        messages: msgSnap.size,
      });
      try {
        const recentQ = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentMessages(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { /* index belum ada */ }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError("");
    setSeedDone(false);
    setProgress(null);

    const result = await runSeeder((p) => setProgress(p), forceOverwrite);

    setSeeding(false);
    if (result.success) {
      setSeedDone(true);
      fetchData(); // refresh stats
    } else {
      setSeedError(result.message);
    }
  };

  const statCards = [
    { label: "Total Produk",      value: stats.products,    icon: Package,       href: "/diegma-panel/produk",      color: "bg-blue-50 text-blue-600" },
    { label: "Total Layanan",     value: stats.services,    icon: Briefcase,     href: "/diegma-panel/layanan",     color: "bg-purple-50 text-purple-600" },
    { label: "Total Subscriber",  value: stats.subscribers, icon: Users,         href: "/diegma-panel/subscribers", color: "bg-green-50 text-green-600" },
    { label: "Pesan Masuk",       value: stats.messages,    icon: MessageSquare, href: "/diegma-panel/pesan",       color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <ProtectedRoute>
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">

          {/* Welcome */}
          <div className="bg-gradient-to-r from-[#111] to-[#333] p-6 text-white">
            <h2 className="text-xl font-bold mb-1">Selamat datang di Admin Panel DIEGMA 👋</h2>
            <p className="text-gray-300 text-sm">Kelola seluruh konten website Anda dari sini.</p>
          </div>

          {/* Init Data Banner — tampil kalau produk & layanan masih kosong */}
          {stats.products === 0 && (
            <div className="border border-[#FFD700] bg-[#FFFBEA] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Website masih kosong!</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Klik "Inisialisasi Data Default" untuk mengisi semua halaman admin dengan konten contoh yang sesuai website Anda.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSeeder(true)}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <Database className="w-4 h-4" />
                Inisialisasi Data Default
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                <Link key={card.label} href={card.href}>
                  <div className="bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className={`w-10 h-10 flex items-center justify-center mb-3 ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Messages */}
          <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Pesan Terbaru</h3>
              <Link href="/diegma-panel/pesan">
                <span className="text-xs text-[#B8860B] hover:underline cursor-pointer flex items-center gap-1">
                  Lihat semua <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">
                Belum ada pesan masuk.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentMessages.map(msg => (
                  <div key={msg.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{msg.name}</p>
                        <p className="text-xs text-gray-500">{msg.email}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{msg.message}</p>
                      </div>
                      {!msg.read && <span className="flex-shrink-0 w-2 h-2 bg-[#FFD700] mt-1.5" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Aksi Cepat</h3>
              <button
                onClick={() => setShowSeeder(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#B8860B] transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Isi Ulang Data Default
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Tambah Produk",      href: "/diegma-panel/produk" },
                { label: "Kelola Layanan",     href: "/diegma-panel/layanan" },
                { label: "Edit Halaman Home",  href: "/diegma-panel/home" },
                { label: "Edit Tentang Kami",  href: "/diegma-panel/tentang" },
                { label: "Pengaturan Website", href: "/diegma-panel/pengaturan" },
                { label: "Lihat Pesan",        href: "/diegma-panel/pesan" },
              ].map(action => (
                <Link key={action.label} href={action.href}>
                  <div className="bg-white border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#FFD700] hover:text-black transition-all cursor-pointer flex items-center justify-between group">
                    {action.label}
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FFD700]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── SEEDER MODAL ──────────────────────────────────────────────────── */}
      {showSeeder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFFBEA] flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Inisialisasi Data Default</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Mengisi semua halaman admin dengan konten contoh</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">

              {/* Selesai */}
              {seedDone && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Berhasil!</p>
                    <p className="text-xs text-green-600 mt-0.5">Semua data default sudah diisi. Buka tiap menu admin untuk mulai edit.</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {seedError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">Gagal menyimpan</p>
                    <p className="text-xs text-red-500 mt-0.5">{seedError}</p>
                    <p className="text-xs text-red-400 mt-1">Pastikan Firebase Security Rules mengizinkan write. Coba lagi.</p>
                  </div>
                </div>
              )}

              {/* Progress */}
              {seeding && progress && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Mengisi data...</span>
                    <span>{progress.step}/{progress.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2">
                    <div
                      className="bg-[#FFD700] h-2 transition-all duration-500"
                      style={{ width: `${(progress.step / progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {progress.label}
                  </p>
                </div>
              )}

              {/* Step list (sebelum mulai) */}
              {!seeding && !seedDone && (
                <>
                  <p className="text-sm text-gray-600">
                    Proses ini akan mengisi Firebase dengan data contoh berikut:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Pengaturan umum (kontak, sosmed, maps)",
                      "Konten halaman Home (hero, statistik)",
                      "Konten halaman Tentang Kami",
                      "Gambar & 9 sub-layanan",
                      "4 produk contoh (furniture & interior)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-[#FFFBEA] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#B8860B]">
                          {i + 1}
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-100 pt-4">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={forceOverwrite}
                        onChange={e => setForceOverwrite(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#FFD700]"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        <span className="font-semibold text-gray-700">Timpa data yang sudah ada</span> — centang ini jika ingin mengulang dari awal. Data lama akan dihapus.
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              {!seedDone ? (
                <>
                  <button
                    onClick={() => { setShowSeeder(false); setSeedError(""); setProgress(null); }}
                    disabled={seeding}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="flex-1 bg-[#FFD700] text-black px-4 py-2.5 text-sm font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {seeding ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                    ) : (
                      <><Database className="w-4 h-4" /> Mulai Inisialisasi</>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowSeeder(false); setSeedDone(false); setProgress(null); }}
                  className="w-full bg-[#111] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#333] transition-colors"
                >
                  Selesai — Mulai Edit Konten
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
    </ProtectedRoute>
  );
}
