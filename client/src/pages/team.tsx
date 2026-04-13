import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Adi Nugroho",
    role: "Principal Architect",
    bio: "Adi memiliki pengalaman lebih dari 15 tahun dalam bidang arsitektur dan telah menangani berbagai proyek prestisius baik di dalam maupun luar negeri. Keahliannya dalam menggabungkan unsur modern dengan sentuhan lokal menjadikan desainnya unik dan berbeda.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    social: {
      instagram: "#",
      linkedin: "#",
      facebook: "#"
    }
  },
  {
    id: 2,
    name: "Maya Putri",
    role: "Interior Design Director",
    bio: "Maya adalah spesialis dalam menciptakan ruang interior yang harmonis dengan latar belakang pendidikan dari Parsons School of Design. Pendekatannya fokus pada menciptakan ruang yang tidak hanya estetis tetapi juga nyaman dan fungsional.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    social: {
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Bimo Prasetyo",
    role: "Project Manager",
    bio: "Dengan lebih dari 10 tahun pengalaman dalam manajemen proyek konstruksi, Bimo memastikan setiap proyek berjalan sesuai jadwal dan anggaran. Keahliannya dalam koordinasi tim dan komunikasi dengan klien menjadi kunci keberhasilan setiap proyek.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    social: {
      instagram: "#",
      linkedin: "#",
      facebook: "#"
    }
  },
  {
    id: 4,
    name: "Sari Dewi",
    role: "Furniture Designer",
    bio: "Sari adalah spesialis dalam desain furnitur custom dengan pengalaman lebih dari 8 tahun. Karya-karyanya menggabungkan keindahan estetika dengan fungsionalitas, menggunakan material berkualitas tinggi dan teknik produksi yang berkelanjutan.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    social: {
      instagram: "#",
      linkedin: "#"
    }
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="py-20 bg-[#F4F4F4]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold font-serif mb-4">Tim Kami</h1>
              <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
              <p className="text-[#4A4A4A] max-w-2xl mx-auto">
                Kenali para profesional berbakat yang membentuk DIEGMA dan membawa visi menjadi kenyataan.
              </p>
            </motion.div>
          </div>
        </div>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-[#F8F8F8] rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <div className="h-full">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-2xl font-bold font-serif mb-2">{member.name}</h3>
                      <p className="text-[#FFD700] font-medium mb-4">{member.role}</p>
                      <p className="text-[#4A4A4A] mb-6">{member.bio}</p>
                      <div className="flex space-x-4">
                        {member.social.instagram && (
                          <a href={member.social.instagram} className="text-gray-600 hover:text-[#FFD700]" aria-label="Instagram">
                            <Instagram size={20} />
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} className="text-gray-600 hover:text-[#FFD700]" aria-label="LinkedIn">
                            <Linkedin size={20} />
                          </a>
                        )}
                        {member.social.facebook && (
                          <a href={member.social.facebook} className="text-gray-600 hover:text-[#FFD700]" aria-label="Facebook">
                            <Facebook size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-[#F4F4F4]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold font-serif mb-6">Bergabung dengan Tim Kami</h2>
              <p className="text-[#4A4A4A] mb-8">
                Kami selalu mencari talenta kreatif dan berdedikasi untuk memperkuat tim kami. Jika Anda memiliki
                passion dalam arsitektur, desain interior, atau konstruksi, kami ingin mendengar dari Anda.
              </p>
              <a
                href={`https://wa.me/6281239243317?text=${encodeURIComponent("Halo DIEGMA, saya tertarik untuk bergabung dengan tim Anda. Apakah ada posisi yang tersedia?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFD700] text-[#333333] font-medium py-3 px-8 rounded hover:bg-[#FFD700]/90 transition-colors"
              >
                Lihat Karir
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}