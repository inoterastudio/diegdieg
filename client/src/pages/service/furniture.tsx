import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Check, Phone, X, MessageSquare, Info, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/seo";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { LazyLoad } from "@/components/shared/lazy-load";
import { useEffect, useState, useRef } from "react";
import { generateProductSchema, generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Furniture product interface
interface FurnitureProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  priceNumeric: number; // For sorting and filtering
  image: string;
  dimensions: string;
  material: string;
  colors: string[];
  inStock: boolean;
  bestSeller?: boolean;
  discount?: number;
  isNew?: boolean;
}

// Product categories for filtering
const productCategories = [
  "Semua",
  "Kursi",
  "Meja",
  "Sofa",
  "Penyimpanan",
  "Kamar Tidur"
];

// Furniture products data
const furnitureProducts: FurnitureProduct[] = [
  {
    id: 1,
    name: "Kursi Santai Modern",
    category: "Kursi",
    description: "Kursi santai dengan desain modern yang menawarkan kenyamanan maksimal dan tampilan elegan untuk ruang tamu Anda.",
    price: "Rp 3.500.000",
    priceNumeric: 3500000,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
    dimensions: "80 x 75 x 90 cm",
    material: "Kayu jati solid dan kain beludru",
    colors: ["Abu-abu", "Biru Navy", "Hijau Olive"],
    inStock: true,
    bestSeller: true
  },
  {
    id: 2,
    name: "Meja Makan Minimalis",
    category: "Meja",
    description: "Meja makan minimalis dengan desain yang bersih dan elegan, cocok untuk ruang makan modern.",
    price: "Rp 7.200.000",
    priceNumeric: 7200000,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7",
    dimensions: "180 x 90 x 75 cm",
    material: "Kayu oak solid dengan finishing natural",
    colors: ["Natural Oak", "Walnut", "Ebony"],
    inStock: true,
    isNew: true
  },
  {
    id: 3,
    name: "Sofa Sectional",
    category: "Sofa",
    description: "Sofa sectional yang nyaman dan luas, sempurna untuk keluarga atau untuk menerima tamu.",
    price: "Rp 15.800.000",
    priceNumeric: 15800000,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    dimensions: "300 x 180 x 85 cm",
    material: "Rangka kayu dengan busa berkualitas tinggi dan kain linen",
    colors: ["Krem", "Abu-abu Muda", "Biru Dusty"],
    inStock: true,
    bestSeller: true,
    discount: 10
  },
  {
    id: 4,
    name: "Rak Buku Modular",
    category: "Penyimpanan",
    description: "Rak buku modular yang dapat disesuaikan dengan kebutuhan dan ruang Anda, dengan desain kontemporer.",
    price: "Rp 4.900.000",
    priceNumeric: 4900000,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156",
    dimensions: "120 x 35 x 180 cm",
    material: "Kayu oak dan besi tempa",
    colors: ["Hitam & Oak", "Putih & Oak", "Seluruhnya Hitam"],
    inStock: true
  },
  {
    id: 5,
    name: "Tempat Tidur Platform",
    category: "Kamar Tidur",
    description: "Tempat tidur platform dengan desain rendah dan modern, termasuk headboard dengan lampu terintegrasi.",
    price: "Rp 8.500.000",
    priceNumeric: 8500000,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    dimensions: "Queen: 160 x 200 cm, King: 180 x 200 cm",
    material: "Kayu mahoni solid dengan finishing premium",
    colors: ["Cokelat Tua", "Hitam", "Putih"],
    inStock: true,
    isNew: true
  },
  {
    id: 6,
    name: "Kabinet TV Minimalis",
    category: "Penyimpanan",
    description: "Kabinet TV minimalis dengan ruang penyimpanan yang cerdas dan manajemen kabel yang rapi.",
    price: "Rp 5.200.000",
    priceNumeric: 5200000,
    image: "https://images.unsplash.com/photo-1606679596345-d48495c95b1d",
    dimensions: "180 x 45 x 50 cm",
    material: "MDF berkualitas tinggi dengan veneer kayu oak",
    colors: ["Putih & Oak", "Hitam & Walnut", "Abu-abu & Oak"],
    inStock: false,
    discount: 15
  },
  {
    id: 7,
    name: "Set Meja Kerja Home Office",
    category: "Meja",
    description: "Set meja kerja home office yang ergonomis dengan penyimpanan terintegrasi untuk ruang kerja produktif.",
    price: "Rp 6.800.000",
    priceNumeric: 6800000,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
    dimensions: "Meja: 140 x 70 x 75 cm, Laci: 45 x 45 x 60 cm",
    material: "Kayu ash dengan aksen besi powder-coated",
    colors: ["Ash & Hitam", "Ash & Putih", "Walnut & Hitam"],
    inStock: true
  },
  {
    id: 8,
    name: "Kursi Makan Set (6)",
    category: "Kursi",
    description: "Set 6 kursi makan dengan desain Skandinavia yang timeless dan nyaman untuk penggunaan sehari-hari.",
    price: "Rp 9.600.000",
    priceNumeric: 9600000,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    dimensions: "45 x 50 x 85 cm (per kursi)",
    material: "Kayu oak dengan dudukan berlapis kain poliester",
    colors: ["Oak & Krem", "Oak & Abu-abu", "Oak & Hijau Sage"],
    inStock: true,
    bestSeller: true
  },
  {
    id: 9,
    name: "Nakas Modern",
    category: "Kamar Tidur",
    description: "Nakas dengan desain modern sebagai pelengkap sempurna untuk kamar tidur kontemporer Anda.",
    price: "Rp 2.350.000",
    priceNumeric: 2350000,
    image: "https://images.unsplash.com/photo-1591129841117-3adfd313a592",
    dimensions: "50 x 40 x 60 cm",
    material: "Kayu oak dengan drawer logam premium",
    colors: ["Putih", "Hitam", "Oak"],
    inStock: true,
    isNew: true
  },
  {
    id: 10,
    name: "Kursi Santai Anyaman",
    category: "Kursi",
    description: "Kursi santai bergaya tropis dengan anyaman rotan dan struktur kayu yang kuat dan ringan.",
    price: "Rp 4.250.000",
    priceNumeric: 4250000,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    dimensions: "75 x 70 x 85 cm",
    material: "Kayu dan rotan alami dengan bantalan premium",
    colors: ["Natural", "Hitam & Natural"],
    inStock: true,
    discount: 5
  },
  {
    id: 11,
    name: "Lemari Pakaian 3-Pintu",
    category: "Kamar Tidur",
    description: "Lemari pakaian 3-pintu dengan berbagai kompartemen internal untuk menyimpan dan mengorganisir pakaian Anda.",
    price: "Rp 11.900.000",
    priceNumeric: 11900000,
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365",
    dimensions: "180 x 60 x 210 cm",
    material: "MDF berkualitas tinggi dengan veneer kayu oak",
    colors: ["Putih", "Oak", "Walnut"],
    inStock: true
  },
  {
    id: 12,
    name: "Meja Kopi Marmer",
    category: "Meja",
    description: "Meja kopi dengan permukaan marmer berkilau dan kaki logam mewah untuk menjadi focal point ruang tamu Anda.",
    price: "Rp 5.800.000",
    priceNumeric: 5800000,
    image: "https://images.unsplash.com/photo-1619596662481-5f992c30a215",
    dimensions: "120 x 70 x 45 cm",
    material: "Marmer asli dengan kaki stainless steel",
    colors: ["Putih Carrara", "Hitam Marquina", "Hijau Alps"],
    inStock: true,
    bestSeller: true
  }
];

export default function FurnitureCatalogPage() {
  // State untuk modal detail produk
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  
  // State untuk filter dan sorting
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState(furnitureProducts);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showAvailable, setShowAvailable] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  
  // Ref untuk modal
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedProduct(null);
        setShowWhatsApp(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);
  
  // Update filtered products when filters change
  useEffect(() => {
    let filtered = [...furnitureProducts];
    
    // Apply category filter
    if (activeCategory !== "Semua") {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Apply color filter
    if (selectedColor) {
      filtered = filtered.filter(product => 
        product.colors.some(color => 
          color.toLowerCase().includes(selectedColor.toLowerCase())
        )
      );
    }
    
    // Apply availability filter
    if (showAvailable) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    // Apply new products filter
    if (showNewOnly) {
      filtered = filtered.filter(product => product.isNew);
    }
    
    // Apply discounted products filter
    if (showDiscounts) {
      filtered = filtered.filter(product => product.discount && product.discount > 0);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.priceNumeric - b.priceNumeric);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.priceNumeric - a.priceNumeric);
        break;
      case "newest":
        filtered.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
        break;
      case "popular":
        filtered.sort((a, b) => (a.bestSeller ? -1 : 1) - (b.bestSeller ? -1 : 1));
        break;
      default:
        // Leave in default order
        break;
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, sortOption, selectedColor, showAvailable, showNewOnly, showDiscounts]);
  
  // Structure data for SEO
  const structuredData = generateServiceSchema({
    name: "Katalog Furniture DIEGMA",
    description: "Produk furniture berkualitas tinggi dengan desain modern untuk ruangan Anda",
    url: "https://www.diegma.com/service/furniture",
    provider: "DIEGMA",
    image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b",
    area: "Indonesia"
  });
  
  // Breadcrumbs structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Beranda", url: "https://www.diegma.com/" },
    { name: "Layanan", url: "https://www.diegma.com/services" },
    { name: "Furniture", url: "https://www.diegma.com/service/furniture" }
  ]);
  
  // Calculate the number of available colors across all products (unique)
  const availableColors = Array.from(
    new Set(
      furnitureProducts.flatMap(product => product.colors)
    )
  ).sort();

  // Format WhatsApp message for product inquiry
  const formatWhatsAppMessage = (product: FurnitureProduct): string => {
    return encodeURIComponent(
      `Halo DIEGMA,\n\nSaya tertarik dengan produk *${product.name}* dengan harga *${product.price}*.\n\nMohon informasi lebih lanjut tentang ketersediaan dan proses pemesanannya.\n\nTerima kasih!`
    );
  };

  return (
    <div className="min-h-screen">
      {/* SEO Implementation */}
      <SEO 
        title="Katalog Furniture | DIEGMA"
        description="Jelajahi koleksi furniture DIEGMA dengan desain modern dan berkualitas tinggi. Tersedia berbagai pilihan kursi, meja, sofa, dan furnitur lainnya."
        ogImage="https://images.unsplash.com/photo-1538688423619-a81d3f23454b"
        structuredData={`[${structuredData},${breadcrumbSchema}]`}
      />
      
      <Navbar />
      <main>
        {/* Hero section */}
        <section className="relative h-[50vh] md:h-[60vh] bg-cover bg-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-black/50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>
          
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <OptimizedImage 
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6" 
              alt="DIEGMA Furniture Collection"
              fill={true}
              priority={true}
              objectFit="cover"
            />
          </motion.div>
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-responsive-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  Koleksi Furniture Premium
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Furnitur berkualitas tinggi dengan desain elegan dan fungsional untuk melengkapi ruang Anda. Dibuat dengan material terbaik dan keahlian premium.
                </motion.p>
                
                <Link href="#catalog">
                  <motion.button
                    className="bg-[#FFD700] text-[#333333] font-medium py-3 px-8 hover:bg-[#FFD700]/90 transition-colors shadow-lg touch-target flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Lihat Katalog
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Catalog section */}
        <section id="catalog" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar with filters - Visible on desktop */}
              <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
                <div className="bg-white shadow-md p-6 sticky top-24">
                  <h3 className="text-lg font-bold mb-6">Filter Produk</h3>
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-500">Kategori</h4>
                    <div className="space-y-2">
                      {productCategories.map(category => (
                        <button
                          key={category}
                          className={`block w-full text-left px-3 py-2 transition-colors ${
                            activeCategory === category 
                              ? 'bg-[#FFD700]/10 text-[#333] font-medium' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Colors */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-500">Warna</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          className={`px-3 py-1 text-xs border transition-colors ${
                            selectedColor === color
                              ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#333]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Options */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-500">Opsi Lainnya</h4>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                          checked={showAvailable}
                          onChange={() => setShowAvailable(!showAvailable)}
                        />
                        <span className="ml-2 text-sm">Tersedia</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                          checked={showNewOnly}
                          onChange={() => setShowNewOnly(!showNewOnly)}
                        />
                        <span className="ml-2 text-sm">Produk Baru</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                          checked={showDiscounts}
                          onChange={() => setShowDiscounts(!showDiscounts)}
                        />
                        <span className="ml-2 text-sm">Diskon</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Reset filters */}
                  <button
                    className="w-full mt-2 px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setActiveCategory("Semua");
                      setSortOption("default");
                      setSelectedColor(null);
                      setShowAvailable(false);
                      setShowNewOnly(false);
                      setShowDiscounts(false);
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-grow">
                {/* Mobile filters in tabs */}
                <div className="md:hidden mb-6">
                  <Tabs defaultValue="category">
                    <TabsList className="w-full">
                      <TabsTrigger value="category" className="flex-1">Kategori</TabsTrigger>
                      <TabsTrigger value="color" className="flex-1">Warna</TabsTrigger>
                      <TabsTrigger value="options" className="flex-1">Opsi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="category" className="px-1 py-4 border mt-2">
                      <div className="flex flex-wrap gap-2">
                        {productCategories.map(category => (
                          <button
                            key={category}
                            className={`px-3 py-1.5 text-sm transition-colors ${
                              activeCategory === category 
                                ? 'bg-[#FFD700] text-[#333] font-medium' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveCategory(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="color" className="px-1 py-4 border mt-2">
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map(color => (
                          <button
                            key={color}
                            className={`px-3 py-1 text-xs border transition-colors ${
                              selectedColor === color
                                ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#333]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="options" className="px-1 py-4 border mt-2">
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                            checked={showAvailable}
                            onChange={() => setShowAvailable(!showAvailable)}
                          />
                          <span className="ml-2 text-sm">Tersedia</span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                            checked={showNewOnly}
                            onChange={() => setShowNewOnly(!showNewOnly)}
                          />
                          <span className="ml-2 text-sm">Produk Baru</span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" 
                            checked={showDiscounts}
                            onChange={() => setShowDiscounts(!showDiscounts)}
                          />
                          <span className="ml-2 text-sm">Diskon</span>
                        </label>
                        
                        <button
                          className="w-full mt-2 px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setActiveCategory("Semua");
                            setSortOption("default");
                            setSelectedColor(null);
                            setShowAvailable(false);
                            setShowNewOnly(false);
                            setShowDiscounts(false);
                          }}
                        >
                          Reset Semua
                        </button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Catalog header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Katalog Produk Furniture</h2>
                    <p className="text-gray-500 text-sm">Menampilkan {filteredProducts.length} produk</p>
                  </div>
                  
                  {/* Sorting options */}
                  <div className="mt-4 sm:mt-0">
                    <select 
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-sm"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="default">Urutan Default</option>
                      <option value="price-asc">Harga: Rendah ke Tinggi</option>
                      <option value="price-desc">Harga: Tinggi ke Rendah</option>
                      <option value="newest">Produk Terbaru</option>
                      <option value="popular">Paling Populer</option>
                    </select>
                  </div>
                </div>
                
                {/* Product grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50">
                    <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Tidak ada produk ditemukan</h3>
                    <p className="text-gray-500">Silakan coba filter lain atau reset filter Anda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProducts.map((product, index) => (
                      <LazyLoad key={product.id}>
                        <motion.div
                          className="bg-white shadow-lg overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col gpu"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          whileHover={{ y: -5 }}
                          onClick={() => setSelectedProduct(product)}
                        >
                          {/* Product image */}
                          <div className="relative h-48 sm:h-64 overflow-hidden cursor-pointer">
                            <OptimizedImage 
                              src={product.image} 
                              alt={product.name}
                              className="transition-transform duration-700 group-hover:scale-110"
                              fill={true}
                              objectFit="cover"
                              quality={70}
                              generateBlurPlaceholder={true}
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {product.isNew && (
                                <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1">Baru</span>
                              )}
                              
                              {product.bestSeller && (
                                <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1">Best Seller</span>
                              )}
                              
                              {product.discount && product.discount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1">Diskon {product.discount}%</span>
                              )}
                              
                              {!product.inStock && (
                                <span className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1">Stok Habis</span>
                              )}
                            </div>
                            
                            {/* Quick view button */}
                            <div className="absolute right-4 bottom-4">
                              <button 
                                className="bg-white/90 backdrop-blur-sm p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(product);
                                }}
                              >
                                <Info className="w-5 h-5 text-gray-700" />
                              </button>
                            </div>
                            
                            {/* Category badge */}
                            <div className="absolute top-4 right-4">
                              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          
                          {/* Product info */}
                          <div className="p-4 sm:p-6 flex-grow flex flex-col">
                            <h3 className="font-bold text-lg mb-1 sm:mb-2">{product.name}</h3>
                            
                            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <div>
                                {product.discount && product.discount > 0 ? (
                                  <>
                                    <p className="text-gray-400 line-through text-xs mb-0.5">
                                      {product.price}
                                    </p>
                                    <p className="font-bold text-[#FFD700]">
                                      Rp {(product.priceNumeric * (100 - product.discount) / 100).toLocaleString('id-ID')}
                                    </p>
                                  </>
                                ) : (
                                  <p className="font-bold text-[#FFD700]">{product.price}</p>
                                )}
                              </div>
                              
                              {product.inStock ? (
                                <a 
                                  href={`https://wa.me/6281239243317?text=${formatWhatsAppMessage(product)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-2 text-sm transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Tanya
                                </a>
                              ) : (
                                <span className="inline-flex items-center justify-center bg-gray-200 text-gray-600 font-medium px-3 py-2 text-sm">
                                  Habis
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </LazyLoad>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Custom Order CTA */}
        <section className="py-16 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567016432779-094069958ea5')] bg-cover bg-center opacity-10 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/80 z-[1]"></div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Butuh Furnitur Custom?</h2>
                <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                  Konsultasikan kebutuhan furniture khusus Anda dengan tim kami. Kami siap membantu mewujudkan furniture impian yang sesuai dengan kebutuhan dan gaya Anda.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contact">
                    <motion.button
                      className="bg-[#FFD700] text-[#333333] font-medium py-3 px-8 hover:bg-[#FFD700]/90 transition-colors shadow-lg w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hubungi Kami
                    </motion.button>
                  </Link>
                  
                  <a 
                    href="https://wa.me/6281239243317?text=Halo%20DIEGMA%2C%20saya%20tertarik%20dengan%20layanan%20furniture%20custom%20Anda.%20Boleh%20saya%20mendapatkan%20informasi%20lebih%20lanjut%3F" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className="bg-white text-gray-900 font-medium py-3 px-8 hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Phone className="w-5 h-5" />
                      Chat WhatsApp
                    </motion.button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={modalRef}
              className="bg-white overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[300px] md:h-full">
                  <OptimizedImage 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    fill={true}
                    objectFit="cover"
                    priority={true}
                    quality={90}
                  />
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {selectedProduct.isNew && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1">Baru</span>
                    )}
                    
                    {selectedProduct.bestSeller && (
                      <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1">Best Seller</span>
                    )}
                    
                    {selectedProduct.discount && selectedProduct.discount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1">Diskon {selectedProduct.discount}%</span>
                    )}
                    
                    {!selectedProduct.inStock && (
                      <span className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1">Stok Habis</span>
                    )}
                  </div>
                  
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => {
                      setSelectedProduct(null);
                      setShowWhatsApp(false);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 md:p-8">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-1 mb-3">
                    {selectedProduct.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                  
                  {selectedProduct.discount && selectedProduct.discount > 0 ? (
                    <div className="mb-4">
                      <p className="text-gray-400 line-through text-sm">
                        {selectedProduct.price}
                      </p>
                      <p className="font-bold text-[#FFD700] text-xl">
                        Rp {(selectedProduct.priceNumeric * (100 - selectedProduct.discount) / 100).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ) : (
                    <p className="font-bold text-[#FFD700] text-xl mb-4">{selectedProduct.price}</p>
                  )}
                  
                  <div className="mb-6">
                    <p className="text-[#4A4A4A] mb-4">{selectedProduct.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="text-sm text-gray-500">Dimensi:</span>
                        <p className="font-medium">{selectedProduct.dimensions}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Material:</span>
                        <p className="font-medium">{selectedProduct.material}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Warna Tersedia:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.colors.map((color, index) => (
                            <span key={index} className="bg-gray-100 px-3 py-1 text-sm">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Ketersediaan:</span>
                        <p className={`font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProduct.inStock ? 'Tersedia' : 'Stok Habis'}
                        </p>
                      </div>
                    </div>
                    
                    {showWhatsApp ? (
                      <div className="bg-green-50 p-4 mb-6">
                        <h4 className="font-bold text-green-800 mb-2">Pesan via WhatsApp</h4>
                        <p className="text-green-700 text-sm mb-4">
                          Silakan kirim pesan ke nomor WhatsApp kami untuk menanyakan tentang {selectedProduct.name}.
                        </p>
                        
                        <a 
                          href={`https://wa.me/6281239243317?text=${formatWhatsAppMessage(selectedProduct)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 transition-colors"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Chat WhatsApp Sekarang
                        </a>
                      </div>
                    ) : (
                      selectedProduct.inStock && (
                        <motion.button
                          className="inline-flex items-center justify-center w-full bg-[#FFD700] text-[#333333] font-medium py-3 px-4 hover:bg-[#FFD700]/90 transition-colors mb-6"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowWhatsApp(true)}
                        >
                          Tanyakan Produk Ini
                        </motion.button>
                      )
                    )}
                    
                    <p className="text-sm text-gray-500 text-center">
                      Anda juga dapat mengunjungi showroom kami untuk melihat produk ini secara langsung.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}