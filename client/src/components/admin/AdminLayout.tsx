import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/admin/AuthContext";
import {
  LayoutDashboard, Package, Wrench,
  Home, Info, MessageSquare, Settings, LogOut,
  Menu, X, ChevronRight, Users
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",    href: "/diegma-panel/dashboard",   icon: LayoutDashboard },
  { label: "Produk",       href: "/diegma-panel/produk",      icon: Package },
  { label: "Layanan",      href: "/diegma-panel/layanan",     icon: Wrench },
  { label: "Halaman Home", href: "/diegma-panel/home",        icon: Home },
  { label: "Tentang Kami", href: "/diegma-panel/tentang",     icon: Info },
  { label: "Pesan Masuk",  href: "/diegma-panel/pesan",       icon: MessageSquare },
  { label: "Subscribers",  href: "/diegma-panel/subscribers", icon: Users },
  { label: "Pengaturan",   href: "/diegma-panel/pengaturan",  icon: Settings },
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
      <aside className={`fixed top-0 left-0 h-full w-56 bg-black text-white z-30 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <span className="text-lg font-bold tracking-tight text-white">DIEGMA</span>
            <span className="block text-xs text-[#FFD700] mt-0.5">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all text-sm ${
                    isActive
                      ? "bg-[#FFD700] text-black font-semibold"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="px-3 py-3 border-t border-white/10">
          <p className="text-xs text-gray-500 truncate px-3 mb-1">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-black">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          </div>
          <Link href="/">
            <span className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer">
              Lihat Website →
            </span>
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}