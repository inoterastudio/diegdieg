import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/admin/AuthContext";
import {
  LayoutDashboard, Package, Wrench, FolderKanban,
  Home, Info, MessageSquare, Settings, LogOut,
  Menu, X, ChevronRight
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",    href: "/diegma-panel/dashboard",  icon: LayoutDashboard },
  { label: "Produk",       href: "/diegma-panel/produk",     icon: Package },
  { label: "Layanan",      href: "/diegma-panel/layanan",    icon: Wrench },
  { label: "Proyek",       href: "/diegma-panel/proyek",     icon: FolderKanban },
  { label: "Halaman Home", href: "/diegma-panel/home",       icon: Home },
  { label: "Tentang Kami", href: "/diegma-panel/tentang",    icon: Info },
  { label: "Pesan Masuk",  href: "/diegma-panel/pesan",      icon: MessageSquare },
  { label: "Pengaturan",   href: "/diegma-panel/pengaturan", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    if (confirm("Yakin ingin keluar?")) await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#111] text-white z-30 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <span className="text-xl font-bold tracking-tighter">DIEGMA</span>
            <span className="block text-xs text-[#FFD700] mt-0.5">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#FFD700] text-black font-semibold"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-gray-400">Login sebagai</p>
            <p className="text-sm text-white font-medium truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-black">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          </div>
          <Link href="/">
            <span className="text-xs text-gray-500 hover:text-black transition-colors cursor-pointer">
              Lihat Website →
            </span>
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
