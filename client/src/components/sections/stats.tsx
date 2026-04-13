import { CountUp } from "@/components/ui/count-up";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  isLast?: boolean;
}

function StatItem({ value, suffix = "", label, isLast = false }: StatItemProps) {
  return (
    <div className={`stats-item text-center py-6 relative ${!isLast ? "md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-[50px] md:after:w-[1px] md:after:bg-gray-200" : ""}`}>
      <CountUp end={value} suffix={suffix} className="text-4xl font-bold font-serif mb-2" />
      <p className="text-[#4A4A4A]">{label}</p>
    </div>
  );
}

export function Stats() {
  const [stats, setStats] = useState({
    statProyek: "250",
    statTahun: "27",
    statKlien: "150",
    statKepuasan: "98",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setStats(prev => ({
            statProyek: d.statProyek || prev.statProyek,
            statTahun: d.statTahun || prev.statTahun,
            statKlien: d.statKlien || prev.statKlien,
            statKepuasan: d.statKepuasan || prev.statKepuasan,
          }));
        }
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  return (
    <motion.section className="py-12 bg-white"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem value={Number(stats.statProyek)} suffix="+" label="Proyek Selesai" />
          <StatItem value={Number(stats.statTahun)} suffix="+" label="Tahun Pengalaman" />
          <StatItem value={Number(stats.statKlien)} suffix="+" label="Klien Puas" />
          <StatItem value={Number(stats.statKepuasan)} suffix="%" label="Tingkat Kepuasan" isLast />
        </div>
      </div>
    </motion.section>
  );
}
