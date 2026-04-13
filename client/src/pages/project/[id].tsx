import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ChevronRight, Check, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/seo";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { LazyLoad } from "@/components/shared/lazy-load";
import { useEffect, useRef } from "react";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { useTheme } from "@/components/theme/theme-provider";

// Project types for filtering
type ProjectType = "all" | "residential" | "commercial" | "interior";

// Project data
interface Project {
  id: number;
  title: string;
  category: string;
  type: ProjectType;
  image: string;
  description: string;
  fullDescription: string;
  location: string;
  year: string;
  client: string;
  area: string;
  architect: string;
  gallery: string[];
  features: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern House Project",
    category: "Residential Design",
    type: "residential",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    description: "Rumah modern dengan sentuhan minimalis yang menciptakan keseimbangan sempurna antara kenyamanan dan estetika.",
    fullDescription: "Proyek rumah modern ini dirancang untuk keluarga muda yang menginginkan ruang tinggal yang nyaman, fungsional, dan estetis. Desain minimalis dengan sentuhan kontemporer menciptakan suasana yang elegan namun tetap hangat. Penggunaan material alami seperti kayu dan batu alam memberikan kehangatan pada interior, sementara jendela besar memaksimalkan cahaya alami dan menciptakan koneksi dengan ruang luar.",
    location: "Jakarta Selatan",
    year: "2023",
    client: "Keluarga Santoso",
    area: "350 m²",
    architect: "Adi Nugroho",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600607687644-c7f34b5063c7",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126"
    ],
    features: [
      "Konsep open-plan untuk area utama",
      "Sistem pencahayaan otomatis hemat energi",
      "Taman atap dengan area relaksasi",
      "Material ramah lingkungan",
      "Smart home system"
    ]
  },
  {
    id: 2,
    title: "Minimalist Interior",
    category: "Interior Design",
    type: "interior",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    description: "Desain interior minimalis dengan fokus pada fungsionalitas dan kenyamanan ruang tinggal.",
    fullDescription: "Proyek redesain interior ini bertujuan untuk mentransformasi apartemen 2-kamar menjadi ruang hidup yang minimalis namun fungsional. Dengan pemilihan furnitur multi-guna dan solusi penyimpanan terintegrasi, desain ini memaksimalkan setiap sudut ruangan tanpa mengorbankan estetika. Palet warna netral dengan aksen biru menciptakan suasana yang tenang dan menenangkan.",
    location: "Bandung",
    year: "2023",
    client: "Bpk. Reza Wijaya",
    area: "85 m²",
    architect: "Maya Putri",
    gallery: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
    ],
    features: [
      "Furnitur multi-fungsi untuk optimalisasi ruang",
      "Solusi penyimpanan terintegrasi",
      "Pencahayaan berlapis untuk menciptakan suasana berbeda",
      "Palet warna netral dengan aksen biru",
      "Material berkualitas tinggi dan tahan lama"
    ]
  },
  {
    id: 3,
    title: "Commercial Space",
    category: "Commercial Design",
    type: "commercial",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    description: "Ruang komersial inovatif yang menggabungkan unsur modern dengan kebutuhan fungsional bisnis.",
    fullDescription: "Proyek desain ruang komersial ini diciptakan untuk startup teknologi yang membutuhkan lingkungan kerja yang menginspirasi kreativitas dan kolaborasi. Desain open-plan dengan area kolaborasi fleksibel memungkinkan tim untuk bekerja secara efisien dalam berbagai konfigurasi. Sentuhan industrial dipadukan dengan elemen hangat menciptakan keseimbangan yang nyaman untuk lingkungan kerja.",
    location: "Jakarta Pusat",
    year: "2022",
    client: "TechNova Inc.",
    area: "450 m²",
    architect: "Adi Nugroho",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094"
    ],
    features: [
      "Layout open-plan dengan area kolaborasi fleksibel",
      "Ruang konferensi dengan teknologi terintegrasi",
      "Area istirahat dan rekreasi untuk karyawan",
      "Sistem akustik berkualitas tinggi",
      "Desain pencahayaan yang mendukung produktivitas"
    ]
  },
  {
    id: 4,
    title: "Villa Harmony",
    category: "Residential Design",
    type: "residential",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    description: "Villa mewah dengan konsep terbuka yang memaksimalkan pemandangan alam sekitar.",
    fullDescription: "Villa Harmony dirancang sebagai retreat mewah yang menyatu dengan lingkungan alamnya. Dengan konsep indoor-outdoor living, villa ini memaksimalkan pemandangan ke laut dan pegunungan. Desain arsitektur kontemporer dengan pengaruh tradisional Bali menciptakan pengalaman yang unik dan autentik bagi penghuninya.",
    location: "Bali",
    year: "2022",
    client: "Keluarga Wijaya",
    area: "580 m²",
    architect: "Adi Nugroho & Maya Putri",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
    ],
    features: [
      "Infinity pool dengan pemandangan laut",
      "Area outdoor living dan dining",
      "Master suite dengan private garden",
      "Material lokal yang dipilih dengan cermat",
      "Sistem otomasi rumah pintar"
    ]
  },
  {
    id: 5,
    title: "Office Redesign",
    category: "Commercial Design",
    type: "commercial",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    description: "Redesain kantor yang menciptakan ruang kerja kolaboratif dan produktif untuk perusahaan teknologi.",
    fullDescription: "Proyek redesain kantor ini bertujuan untuk mentransformasi ruang kerja konvensional menjadi lingkungan yang mendorong inovasi dan kolaborasi. Dengan pengaturan ulang layout dan penambahan area diskusi informal, desain baru menciptakan alur kerja yang lebih efisien dan suasana yang lebih dinamis.",
    location: "Jakarta Selatan",
    year: "2023",
    client: "GlobalTech Solutions",
    area: "650 m²",
    architect: "Bimo Prasetyo",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
    ],
    features: [
      "Workstation ergonomis yang dapat disesuaikan",
      "Phone booth untuk panggilan pribadi",
      "Area brainstorming dengan peralatan interaktif",
      "Kafetaria dengan berbagai pilihan tempat duduk",
      "Sistem pencahayaan dinamis yang mengikuti ritme sirkadian"
    ]
  },
  {
    id: 6,
    title: "Apartment Makeover",
    category: "Interior Design",
    type: "interior",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
    description: "Transformasi apartemen kecil menjadi ruang yang fungsional dan elegan dengan solusi penyimpanan cerdas.",
    fullDescription: "Proyek makeover apartemen ini mendemonstrasikan bagaimana ruang kecil dapat ditransformasikan menjadi hunian yang fungsional dan estetis. Dengan pendekatan desain yang cermat dan solusi penyimpanan custom, apartemen studio ini kini terasa lebih luas dan terorganisir dengan baik.",
    location: "Jakarta Barat",
    year: "2022",
    client: "Ibu Anita",
    area: "45 m²",
    architect: "Sari Dewi",
    gallery: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc"
    ],
    features: [
      "Furnitur modular yang dapat disesuaikan dengan kebutuhan",
      "Storage terintegrasi pada dinding dan lantai",
      "Partisi geser untuk fleksibilitas ruang",
      "Palet warna terang untuk kesan ruang lebih luas",
      "Pencahayaan yang dioptimalkan untuk berbagai aktivitas"
    ]
  }
];

export default function ProjectDetailPage() {
  // Get the project ID from the URL
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { theme } = useTheme();
  
  // Ref for the content section to track visibility
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Find the project by ID
  const project = projects.find(p => p.id === projectId);
  
  // Format WhatsApp message for project
  const formatWhatsAppMessage = (projectTitle: string): string => {
    return encodeURIComponent(
      `Halo DIEGMA,\n\nSaya tertarik dengan proyek *${projectTitle}*.\n\nBoleh saya mendapatkan informasi lebih lanjut tentang proyek serupa untuk kebutuhan saya?\n\nTerima kasih!`
    );
  };
  
  // Scroll to top on page load or when projectId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);
  
  // If project not found, show error
  if (!project) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <Navbar />
        <main className="relative py-24 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${
            theme === "dark" 
              ? "from-gray-900/50 to-gray-950/30"
              : "from-gray-50 to-gray-100"
          } z-0`}></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FFD700]/10 blur-3xl z-0"></div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white"
              } p-10 shadow-xl max-w-lg mx-auto`}
            >
              <h1 className="text-3xl font-bold mb-4">Proyek Tidak Ditemukan</h1>
              <p className={`mb-8 ${
                theme === "dark" ? "text-gray-300" : "text-[#4A4A4A]"
              }`}>Maaf, proyek yang Anda cari tidak ditemukan.</p>
              <Link href="/projects">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[#FFD700] text-[#333333] hover:bg-[#FFD700]/90">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar Proyek
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Find related projects (same type but different ID)
  const relatedProjects = projects
    .filter(p => p.type === project.type && p.id !== project.id)
    .slice(0, 3);

  // Generate structured data for SEO
  const structuredData = generateProductSchema({
    name: project.title,
    description: project.description,
    image: project.image,
    price: '',
    url: `https://www.diegma.com/project/${project.id}`,
    brand: 'DIEGMA'
  });
  
  // Generate breadcrumb schema for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Beranda', url: 'https://www.diegma.com/' },
    { name: 'Proyek', url: 'https://www.diegma.com/projects' },
    { name: project.title, url: `https://www.diegma.com/project/${project.id}` },
  ]);

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* SEO Implementation */}
      <SEO 
        title={`${project.title} - ${project.category}`}
        description={project.description}
        ogImage={project.image}
        structuredData={`[${structuredData},${breadcrumbSchema}]`}
      />
      
      <Navbar />
      <main>
        {/* Hero section with parallax effect */}
        <section className="relative h-[70vh] md:h-[80vh] bg-cover bg-center overflow-hidden">
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
              src={project.image} 
              alt={project.title}
              fill={true}
              priority={true}
              quality={90}
              objectFit="cover"
            />
          </motion.div>
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Link href="/projects">
                  <motion.div 
                    className="inline-flex items-center text-white hover:text-[#FFD700] mb-6 transition-colors cursor-pointer touch-target"
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Kembali ke Proyek
                  </motion.div>
                </Link>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-responsive-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {project.title}
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  {project.description}
                </motion.p>
                
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm text-white">
                    {project.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm text-white">
                    {project.location}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm text-white">
                    {project.year}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            <ChevronRight className="w-8 h-8 text-white transform rotate-90" />
          </motion.div>
        </section>
        
        {/* Project details */}
        <section className="py-20 relative overflow-hidden cv-auto">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/20 to-transparent z-0"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
              <div ref={contentRef} className="lg:col-span-2">
                <LazyLoad>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold mb-4 text-responsive-lg dark:text-white">Tentang Proyek</h2>
                      <div className="w-16 h-1 bg-[#FFD700] mb-8"></div>
                      <p className="text-[#4A4A4A] dark:text-gray-300 text-lg mb-8 leading-relaxed">
                        {project.fullDescription}
                      </p>
                    </div>
                    
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold mb-6 text-responsive-md dark:text-white">Fitur Utama</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.features.map((feature, index) => (
                          <motion.div 
                            key={index} 
                            className={`flex items-start p-4 transition-colors ${
                              theme === "dark" 
                                ? "bg-gray-800 hover:bg-gray-700" 
                                : "bg-gray-50 hover:bg-[#FFFBEA]"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="w-8 h-8 bg-[#FFD700] flex items-center justify-center flex-shrink-0 mr-4">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className={`${
                              theme === "dark" ? "text-gray-200" : "text-[#4A4A4A]"
                            }`}>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </LazyLoad>
                
                <LazyLoad>
                  <div className="mb-12">
                    <motion.h3 
                      className="text-2xl font-bold mb-6 text-responsive-md dark:text-white"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      Galeri Proyek
                    </motion.h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {project.gallery.map((image, index) => (
                        <motion.div
                          key={index}
                          className="overflow-hidden shadow-lg group relative"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.15 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="relative overflow-hidden aspect-4-3">
                            {/* Subtle overlay effect on hover without text */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            </div>
                            
                            {/* Optimized image with zoom effect */}
                            <OptimizedImage 
                              src={image} 
                              alt={`${project.title} gallery ${index + 1}`}
                              className="transition-transform duration-700 group-hover:scale-110 w-full h-full"
                              objectFit="cover"
                              fill={true}
                              quality={75}
                              useSrcSet={true}
                              lazyLoad={true}
                              generateBlurPlaceholder={true}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </LazyLoad>
                
                <LazyLoad>
                  <motion.div 
                    className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-10 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold mb-3 text-responsive-md">Tertarik dengan proyek ini?</h3>
                        <p className="text-gray-300 mb-6 md:mb-0">
                          Konsultasikan kebutuhan Anda dengan tim kami dan temukan solusi desain yang tepat untuk Anda.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <a 
                          href={`https://wa.me/6281239243317?text=${formatWhatsAppMessage(project.title)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <motion.button
                            className="bg-[#FFD700] text-[#333333] font-medium py-3 px-8 hover:bg-[#FFD700]/90 transition-colors shadow-lg touch-target flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MessageSquare className="w-5 h-5" />
                            Hubungi Kami
                          </motion.button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </LazyLoad>
              </div>
              
              <LazyLoad>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="self-start"
                >
                  <div className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white"
                  } p-8 shadow-lg sticky top-24`}>
                    <h3 className="text-2xl font-bold mb-6 text-responsive-md">Informasi Proyek</h3>
                    <div className="w-12 h-1 bg-[#FFD700] mb-8"></div>
                    
                    <div className="space-y-6">
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Kategori</p>
                        <p className="font-medium">{project.category}</p>
                      </div>
                      
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Lokasi</p>
                        <p className="font-medium">{project.location}</p>
                      </div>
                      
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Tahun</p>
                        <p className="font-medium">{project.year}</p>
                      </div>
                      
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Klien</p>
                        <p className="font-medium">{project.client}</p>
                      </div>
                      
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Luas</p>
                        <p className="font-medium">{project.area}</p>
                      </div>
                      
                      <div className={`${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-[#FFFBEA]"
                      } p-4 transition-colors`}>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-1`}>Arsitek</p>
                        <p className="font-medium">{project.architect}</p>
                      </div>
                    </div>
                    
                    <div className={`mt-8 pt-6 ${
                      theme === "dark" ? "border-t border-gray-700" : "border-t border-gray-100"
                    }`}>
                      <Link href="/projects">
                        <motion.div
                          className={`inline-flex items-center ${
                            theme === "dark"
                              ? "text-white hover:text-[#FFD700]"
                              : "text-[#333] hover:text-[#FFD700]"
                          } font-medium transition-colors cursor-pointer touch-target`}
                          whileHover={{ x: -5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Kembali ke Semua Proyek
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </LazyLoad>
            </div>
          </div>
        </section>
        
        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <section className={`py-24 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          } relative overflow-hidden cv-auto`}>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFD700]/5 blur-3xl z-0"></div>
            
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
              <LazyLoad>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-center mb-16"
                >
                  <h2 className={`text-3xl font-bold mb-4 text-responsive-lg ${
                    theme === "dark" ? "text-white" : ""
                  }`}>Proyek Terkait</h2>
                  <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-8"></div>
                  <p className={`${
                    theme === "dark" ? "text-gray-300" : "text-[#4A4A4A]"
                  } max-w-xl mx-auto`}>
                    Jelajahi proyek lain yang serupa dengan {project.title}
                  </p>
                </motion.div>
              </LazyLoad>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                {relatedProjects.map((relatedProject, index) => (
                  <LazyLoad key={relatedProject.id}>
                    <motion.div
                      className={`group ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      } overflow-hidden shadow-lg h-full gpu`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.15 }}
                      whileHover={{ y: -10 }}
                    >
                      <Link href={`/project/${relatedProject.id}`}>
                        <div className="cursor-pointer h-full flex flex-col">
                          {/* Image container with effects */}
                          <div className="relative overflow-hidden h-[250px]">
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 opacity-60 z-10"></div>
                            
                            {/* Optimized image with zoom effect */}
                            <OptimizedImage 
                              src={relatedProject.image} 
                              alt={relatedProject.title}
                              className="transition-transform duration-700 group-hover:scale-110"
                              objectFit="cover"
                              fill={true}
                              quality={70}
                              generateBlurPlaceholder={true}
                            />
                            
                            {/* Category badge */}
                            <div className="absolute top-4 left-4 z-20">
                              <motion.span 
                                className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-medium"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                              >
                                {relatedProject.type === "residential" ? "Residensial" : 
                                relatedProject.type === "commercial" ? "Komersial" : "Interior"}
                              </motion.span>
                            </div>
                            
                            {/* View project overlay */}
                            <div className="absolute inset-0 bg-[#FFD700]/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-md p-3 transition-transform">
                                <ArrowRight className="w-6 h-6 text-gray-800" />
                              </div>
                            </div>
                            
                            {/* Title overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                              <h3 className="text-xl font-bold text-white mb-1">
                                {relatedProject.title}
                              </h3>
                              <p className="text-white/80 text-sm">
                                {relatedProject.location}, {relatedProject.year}
                              </p>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6 flex-grow flex flex-col">
                            <p className={`${
                              theme === "dark" ? "text-gray-300" : "text-[#4A4A4A]"
                            } mb-6 line-clamp-2 flex-grow`}>
                              {relatedProject.description}
                            </p>
                            
                            {/* Action link */}
                            <motion.div
                              className={`flex items-center justify-between mt-4 pt-4 ${
                                theme === "dark" ? "border-t border-gray-700" : "border-t border-gray-100"
                              }`}
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className={`font-medium ${
                                theme === "dark" ? "text-gray-100" : ""
                              }`}>Lihat Detail Proyek</span>
                              <div className={`w-8 h-8 ${
                                theme === "dark" 
                                  ? "bg-gray-700 group-hover:bg-[#FFD700]" 
                                  : "bg-[#f8f8f8] group-hover:bg-[#FFD700]"
                              } flex items-center justify-center transition-colors duration-300`}>
                                <ArrowRight className={`w-4 h-4 ${
                                  theme === "dark"
                                    ? "text-gray-300 group-hover:text-[#111]"
                                    : "text-gray-700 group-hover:text-[#111]"
                                } transition-colors duration-300`} />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </LazyLoad>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}