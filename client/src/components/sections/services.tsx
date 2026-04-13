import { ArrowRight, PencilRuler, HardHat, Sofa } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  href: string;
  delay: number;
}

function ServiceCard({ icon, title, description, image, href, delay }: ServiceCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 service-card group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -10 }}
    >
      <div className="relative h-60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <motion.img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="flex items-center space-x-3 mb-2"
          >
            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </motion.div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-[#4A4A4A] mb-6">
          {description}
        </p>
        
        <Link href={href}>
          <motion.div
            whileHover={{ x: 5 }}
            className="inline-flex items-center font-medium text-[#111] hover:text-[#FFD700] transition-colors cursor-pointer"
          >
            <span>Lihat Selengkapnya</span>
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

export function Services() {
  const services = [
    {
      icon: <PencilRuler className="text-xl text-[#111]" />,
      title: "Desain Interior & Eksterior",
      description: "Layanan desain komprehensif untuk menciptakan ruang yang fungsional, estetis, dan sesuai dengan kebutuhan Anda. Kami memadukan kreativitas dan keahlian teknis untuk menghasilkan desain yang memenuhi standar tertinggi.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      href: "/service/interior-exterior",
      delay: 0
    },
    {
      icon: <HardHat className="text-xl text-[#111]" />,
      title: "Konstruksi",
      description: "Implementasi proyek yang profesional dengan fokus pada kualitas, efisiensi, dan kepatuhan terhadap standar keamanan. Tim kami memastikan setiap detail diperhatikan dengan cermat dari awal hingga akhir proyek.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
      href: "/service/construction",
      delay: 0.2
    },
    {
      icon: <Sofa className="text-xl text-[#111]" />,
      title: "Furniture",
      description: "Desain dan produksi furniture custom yang menggabungkan estetika, fungsionalitas, dan kualitas terbaik. Kami menciptakan furnitur yang tidak hanya indah tetapi juga tahan lama dan sesuai dengan kebutuhan spesifik Anda.",
      image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b",
      href: "/service/furniture",
      delay: 0.4
    }
  ];

  return (
    <section id="layanan" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Layanan Kami</h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-8"></div>
          </motion.div>
          
          <p className="text-[#4A4A4A] max-w-2xl mx-auto text-lg">
            Kami menawarkan berbagai layanan desain dan konstruksi untuk memenuhi kebutuhan proyek Anda, 
            dari konsep awal hingga implementasi akhir.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              image={service.image}
              href={service.href}
              delay={service.delay}
            />
          ))}
        </div>
        
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#111] font-medium py-3 px-8 rounded-md shadow-md btn-premium"
            >
              Lihat Semua Layanan
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
