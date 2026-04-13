import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/components/admin/AuthContext";
import Home from "@/pages/home";
import AboutPage from "@/pages/about";
import ProjectsPage from "@/pages/projects";
import ProjectDetailPage from "@/pages/project/[id]";
import ProductsPage from "@/pages/products";
import ProductDetailPage from "@/pages/products/[id]";
import ServicesPage from "@/pages/services";
import ServiceDetailPage from "@/pages/service/[id]";
import ContactPage from "@/pages/contact";
import KebijakanPrivasiPage from "@/pages/kebijakan-privasi";
import SyaratKetentuanPage from "@/pages/syarat-ketentuan";
import NotFound from "@/pages/not-found";
// Admin pages
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProduk from "@/pages/admin/produk";
import AdminPesan from "@/pages/admin/pesan";
import AdminSubscribers from "@/pages/admin/subscribers";
import AdminPengaturan from "@/pages/admin/pengaturan";
import AdminHalamanHome from "@/pages/admin/home";
import AdminTentangKami from "@/pages/admin/tentang";
import AdminLayanan from "@/pages/admin/layanan";
import { AdminTim, AdminProyek } from "@/pages/admin/crud-pages";

const startTime = performance.now();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/project/:id" component={ProjectDetailPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/products/:id" component={ProductDetailPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/service/:id" component={ServiceDetailPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/kebijakan-privasi" component={KebijakanPrivasiPage} />
        <Route path="/syarat-ketentuan" component={SyaratKetentuanPage} />
        {/* Admin Routes - Hidden URL */}
        <Route path="/diegma-panel" component={AdminLoginPage} />
        <Route path="/diegma-panel/dashboard" component={AdminDashboard} />
        <Route path="/diegma-panel/produk" component={AdminProduk} />
        <Route path="/diegma-panel/layanan" component={AdminLayanan} />
        <Route path="/diegma-panel/proyek" component={AdminProyek} />
        <Route path="/diegma-panel/tim" component={AdminTim} />
        <Route path="/diegma-panel/home" component={AdminHalamanHome} />
        <Route path="/diegma-panel/tentang" component={AdminTentangKami} />
        <Route path="/diegma-panel/pesan" component={AdminPesan} />
        <Route path="/diegma-panel/subscribers" component={AdminSubscribers} />
        <Route path="/diegma-panel/pengaturan" component={AdminPengaturan} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;