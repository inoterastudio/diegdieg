import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, ImageIcon, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

type ProjectType = "all" | "residential" | "commercial" | "interior";

interface Project {
  id: string;
  title: string;
  category: string;
  type: ProjectType;
  image: string;
  description: string;
  location: string;
  year: string;
}

const TYPE_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "interior", label: "Interior" },
];

const WA_NUMBER = "6281239243317";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<ProjectType>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "proyek"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(p =>
    activeType === "all" || p.type === activeType || p.category?.toLowerCase().includes(activeType)
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-[#FAF8F5] border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Proyek Kami</h1>
            <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6" />
            <p className="text-[#4A4A4A] max-w-2xl mx-auto text-lg">
              Kumpulan proyek terbaik yang telah kami kerjakan. Setiap karya mencerminkan komitmen kami terhadap kualitas dan keindahan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-[#FAF8F5]/95 sticky top-20 z-30 border-b border-gray-100 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map(t => (
              <button key={t.value} onClick={() => setActiveType(t.value as ProjectType)}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  activeType === t.value
                    ? "bg-[#FFD700] text-black shadow-md"
                    : "bg-white/70 border border-gray-200 text-gray-600 hover:border-[#FFD700] hover:text-black"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" />
              <p className="text-gray-400">Memuat proyek...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div key={activeType}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filtered.map((project, i) => (
                    <motion.div key={project.id}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group bg-white/80 border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="relative h-64 bg-[#E8E4DC] overflow-hidden">
                        {project.image ? (
                          <img src={project.image} alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        {project.category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-[#FAF8F5]/90 backdrop-blur-sm text-xs font-medium px-3 py-1 text-gray-700">
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#B8860B] transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          {project.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
                          )}
                          {project.year && (
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.year}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    {projects.length === 0 ? "Belum ada proyek yang ditampilkan." : "Proyek tidak ditemukan."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}