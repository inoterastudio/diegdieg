import { motion } from "framer-motion";
import { Award, Briefcase, Users } from "lucide-react";

// Projects stats for animation
const projectStats = [
  { 
    id: 1, 
    icon: <Award className="w-10 h-10 text-[#FFD700]" />,
    value: 120,
    label: "Proyek Selesai",
    description: "Proyek yang telah berhasil diselesaikan dengan kepuasan klien"
  },
  { 
    id: 2, 
    icon: <Users className="w-10 h-10 text-[#FFD700]" />,
    value: 85,
    label: "Klien Puas",
    description: "Klien yang telah mempercayakan proyek desain kepada kami"
  },
  { 
    id: 3, 
    icon: <Briefcase className="w-10 h-10 text-[#FFD700]" />,
    value: 15,
    label: "Tahun Pengalaman",
    description: "Tahun pengalaman dalam industri desain dan arsitektur"
  }
];

// Custom counter animation hook could be added here if needed

export function Clients() {
  return (
    <motion.section 
      className="relative py-24 bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-[#FFD700]/10 -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-[#FFD700]/5 translate-x-1/2 blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pengalaman & Keahlian</h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
          <p className="text-[#4A4A4A] max-w-2xl mx-auto text-lg">
            Kami membangun kepercayaan melalui desain yang melebihi ekspektasi dan pelayanan yang luar biasa
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectStats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              {/* Background overlay animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Content with animated border */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 bg-white p-5 rounded-full group-hover:bg-white transition-colors duration-300">
                  {stat.icon}
                </div>
                
                <motion.h3 
                  className="text-4xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.3 + index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <span className="text-[#333]">{stat.value}</span>
                  <span className="text-[#FFD700]">+</span>
                </motion.h3>
                
                <h4 className="text-xl font-bold mb-4 text-[#333]">{stat.label}</h4>
                <p className="text-[#4A4A4A]">{stat.description}</p>
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-1 bg-[#FFD700] transform rotate-45 translate-y-2 translate-x-1"></div>
                <div className="absolute top-0 right-0 w-1 h-12 bg-[#FFD700] transform rotate-45 translate-y-1 translate-x-2"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
