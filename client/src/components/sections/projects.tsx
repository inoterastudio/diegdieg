import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Project types for filtering
type ProjectType = "all" | "residential" | "commercial" | "interior";

// Project data
interface Project {
  id: number;
  title: string;
  category: string;
  type: ProjectType;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern House Project",
    category: "Residential Design",
    type: "residential",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
  },
  {
    id: 2,
    title: "Minimalist Interior",
    category: "Interior Design",
    type: "interior",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
  },
  {
    id: 3,
    title: "Commercial Space",
    category: "Commercial Design",
    type: "commercial",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  }
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectType>("all");
  
  // Filter projects based on active filter
  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.type === activeFilter);

  return (
    <section id="proyek" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-serif mb-4">Proyek Kami</h2>
          <p className="text-[#4A4A4A] max-w-2xl mx-auto">
            Temukan beragam karya dan proyek yang telah kami selesaikan, dari residensial hingga komersial, 
            dengan berbagai gaya dan pendekatan desain.
          </p>
        </motion.div>
        
        <motion.div 
          className="mb-8 flex justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { type: "all", label: "Semua" },
            { type: "residential", label: "Residensial" },
            { type: "commercial", label: "Komersial" },
            { type: "interior", label: "Interior" }
          ].map((filter) => (
            <button
              key={filter.type}
              className={`px-6 py-2 rounded-full shadow-sm hover:bg-[#FFD700] transition-colors ${
                activeFilter === filter.type ? "bg-[#FFD700]" : "bg-white"
              }`}
              onClick={() => setActiveFilter(filter.type as ProjectType)}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              className="group rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/project/${project.id}`} className="block relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="font-serif font-bold text-xl mb-2">{project.title}</h3>
                    <p className="text-sm">{project.category}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button className="bg-[#FFD700] text-[#333333] font-medium py-3 px-8 rounded hover:bg-[#FFD700]/90 transition-colors">
            Lihat Semua Proyek
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
