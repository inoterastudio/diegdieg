/**
 * DIEGMA — Default Content Seeder
 * Mengisi semua koleksi Firebase dengan konten default yang sesuai website.
 * Dijalankan sekali dari admin dashboard.
 */

import { db } from "@/lib/firebase";
import {
  doc, setDoc, collection, addDoc, getDocs, deleteDoc, serverTimestamp
} from "firebase/firestore";

// ─── DEFAULT MAPS URL ───────────────────────────────────────────────────────
const DEFAULT_MAPS =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.530827997742!2d107.60380937461487!3d-6.914744293082574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9adf177bf8d%3A0x437398556f9b63d3!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1684151339634!5m2!1sen!2sid";

// ─── STEP 1: settings/main (Halaman Home + Pengaturan) ──────────────────────
const DEFAULT_MAIN_SETTINGS = {
  // Hero Beranda
  heroTitle: "Di Mana Keahlian\nBertemu Keindahan.",
  heroSubtitle:
    "Kami percaya bahwa desain yang baik harus mencerminkan kepribadian klien, sambil memperhatikan konteks lingkungan dan budaya.",
  heroButtonText: "Konsultasi Sekarang",
  heroImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80",

  // Statistik
  statProyek: "250",
  statTahun: "27",
  statKlien: "150",
  statKepuasan: "98",

  // About preview di beranda
  aboutTitle: "Tentang Studio Kami",
  aboutDesc1:
    "DIEGMA adalah studio arsitektur dan desain interior yang berdedikasi untuk menciptakan ruang yang fungsional, estetis, dan bermakna.",
  aboutDesc2:
    "Dengan tim profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal hingga implementasi akhir yang melampaui ekspektasi.",

  // Kontak & Pengaturan
  whatsapp: "6281239243317",
  phone: "+62 812-3924-3317",
  email: "info@diegma.com",
  address: "Bandung, Jawa Barat, Indonesia",
  instagram: "https://instagram.com/diegma",
  facebook: "https://facebook.com/diegma",
  linkedin: "https://linkedin.com/company/diegma",
  website: "https://diegma.com",
  jamOperasional: "Senin – Jumat: 08.00 – 17.00 WIB\nSabtu: 09.00 – 14.00 WIB",
  mapsUrl: DEFAULT_MAPS,
};

// ─── STEP 2: settings/about (Halaman Tentang Kami) ──────────────────────────
const DEFAULT_ABOUT_SETTINGS = {
  headline: "Studio Arsitektur & Desain Interior.",
  description1:
    "DIEGMA lahir dari keyakinan bahwa setiap ruang memiliki potensi untuk menjadi karya yang bermakna — bukan sekadar tempat tinggal, tapi ekspresi jiwa penghuninya.",
  description2:
    "Dengan para profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal, perencanaan ruang, hingga implementasi akhir yang melampaui ekspektasi.",
  vision:
    "Menjadi studio desain terkemuka yang mengubah ruang menjadi pengalaman hidup yang luar biasa bagi setiap klien kami.",
  mission:
    "Memberikan solusi desain terbaik yang memadukan estetika, fungsi, dan keberlanjutan dengan standar kualitas tertinggi di setiap proyek.",
  values: [
    {
      title: "Kualitas Premium",
      description:
        "Kami berkomitmen memberikan hasil dengan standar tertinggi di setiap aspek karya kami — dari material, pengerjaan, hingga hasil akhir.",
    },
    {
      title: "Kolaborasi",
      description:
        "Proses desain yang melibatkan Anda di setiap tahapan untuk menghasilkan ruang yang benar-benar personal dan sesuai kebutuhan.",
    },
    {
      title: "Ketepatan Waktu",
      description:
        "Menghargai waktu Anda dengan menyelesaikan setiap proyek sesuai jadwal yang ditetapkan — tanpa kompromi terhadap kualitas.",
    },
    {
      title: "Inovasi",
      description:
        "Terus menghadirkan solusi desain terkini yang relevan, unik, dan bermakna untuk setiap ruang yang kami rancang.",
    },
  ],
  aboutSectionImage:
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
  aboutStudioImage: "",
};

// ─── STEP 3: settings/layanan-images (Gambar Utama Kategori Layanan) ────────
const DEFAULT_LAYANAN_IMAGES = {
  "interior-eksterior":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
  konstruksi:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80",
  furniture:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
};

// ─── STEP 4: collection/layanan (9 sub-layanan items) ───────────────────────
const DEFAULT_LAYANAN_ITEMS = [
  // Kategori: Desain Interior & Eksterior
  {
    category: "interior-eksterior",
    title: "Desain Ruang Residensial",
    description:
      "Transformasi hunian Anda menjadi ruang yang mencerminkan kepribadian dan gaya hidup — dari rumah minimalis modern hingga klasik elegan.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    startPrice: "Mulai dari Rp 15.000.000",
  },
  {
    category: "interior-eksterior",
    title: "Desain Ruang Komersial",
    description:
      "Ciptakan ruang bisnis yang profesional, fungsional, dan merepresentasikan identitas brand Anda — dari kantor, kafe, hingga retail.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    startPrice: "Mulai dari Rp 25.000.000",
  },
  {
    category: "interior-eksterior",
    title: "Desain Eksterior & Fasad",
    description:
      "Tampilan luar bangunan yang memukau dan berkarakter — memadukan estetika arsitektur modern dengan kearifan lokal.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    startPrice: "Mulai dari Rp 12.000.000",
  },

  // Kategori: Konstruksi & Renovasi
  {
    category: "konstruksi",
    title: "Konstruksi Bangunan Baru",
    description:
      "Bangun hunian atau bangunan komersial impian dari nol dengan standar kualitas tertinggi dan manajemen proyek yang terstruktur.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    startPrice: "Mulai dari Rp 3.500.000/m²",
  },
  {
    category: "konstruksi",
    title: "Renovasi & Restorasi",
    description:
      "Hadirkan tampilan baru pada bangunan lama — dari perombakan total, perluasan ruang, hingga restorasi elemen-elemen bersejarah.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    startPrice: "Mulai dari Rp 2.000.000/m²",
  },
  {
    category: "konstruksi",
    title: "Manajemen Proyek Konstruksi",
    description:
      "Pengawasan penuh dari awal hingga selesai — memastikan proyek berjalan sesuai anggaran, jadwal, dan spesifikasi yang disepakati.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    startPrice: "Hubungi Kami",
  },

  // Kategori: Furniture Custom
  {
    category: "furniture",
    title: "Furniture Rumah Tinggal",
    description:
      "Furniture custom yang dirancang khusus sesuai dimensi dan karakter ruang Anda — dari ruang tamu, kamar tidur, hingga ruang keluarga.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    startPrice: "Mulai dari Rp 5.000.000/pcs",
  },
  {
    category: "furniture",
    title: "Furniture Komersial",
    description:
      "Solusi furniture untuk ruang bisnis: meja kantor, workstation, storage cabinet, hingga display counter retail yang fungsional dan estetis.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    startPrice: "Mulai dari Rp 8.000.000",
  },
  {
    category: "furniture",
    title: "Aksesoris & Dekorasi Interior",
    description:
      "Sentuhan akhir yang menyempurnakan ruang — cermin, rak dekorasi, lampu, dan aksesori interior pilihan yang memperindah setiap sudut.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    startPrice: "Mulai dari Rp 500.000/pcs",
  },
];

// ─── STEP 5: collection/products (4 contoh produk) ─────────────────────────
const DEFAULT_PRODUCTS = [
  {
    name: "Meja Kerja Minimalis",
    category: "furniture",
    price: "4500000",
    description:
      "Meja kerja dengan desain minimalis modern yang memadukan fungsi optimal dan estetika ruang. Cocok untuk home office maupun ruang kerja profesional.",
    specs:
      "Ukuran: 120×60×75 cm\nMaterial: Kayu Jati Solid\nFinishing: Natural Oil\nBerat: 25 kg",
    features:
      "Anti rayap & anti jamur\nFinishing premium food-grade\nGaransi material 2 tahun\nRamah lingkungan",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    visible: true,
  },
  {
    name: "Sofa L-Shape Modern",
    category: "furniture",
    price: "18500000",
    description:
      "Sofa L-shape dengan desain kontemporer — kenyamanan premium untuk ruang keluarga modern. Busa high-density dengan cover fabric berkualitas tinggi.",
    specs:
      "Ukuran: 280×160×80 cm\nMaterial: Frame Kayu Karet + Busa HD\nCover: Fabric Premium\nBerat: 65 kg",
    features:
      "Cushion high-density 35D\nFabric anti-noda\nStruktur kayu solid\nCustom warna tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    visible: true,
  },
  {
    name: "Lemari Pakaian 4 Pintu",
    category: "furniture",
    price: "12000000",
    description:
      "Lemari pakaian 4 pintu dengan sistem penyimpanan yang terorganisir — dilengkapi laci, gantungan, dan rak sepatu terintegrasi dalam satu unit.",
    specs:
      "Ukuran: 200×60×220 cm\nMaterial: Plywood Premium 18mm\nFinishing: HPL Doff\nBerat: 80 kg",
    features:
      "Anti lembab & rayap\nSistem engsel soft-close\nPartisi dalam fleksibel\nCustom ukuran tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    visible: true,
  },
  {
    name: "Kitchen Set Modern Minimalis",
    category: "interior",
    price: "35000000",
    description:
      "Kitchen set full-set dengan desain minimalis modern — kabinet bawah, kabinet atas, island, dan backsplash terintegrasi untuk dapur impian Anda.",
    specs:
      "Panjang: 3 meter (L-shape)\nMaterial: Plywood 18mm + Solid Surface\nFinishing: HPL Matte\nTop Table: Granit/Marmer",
    features:
      "Soft-close drawer system\nTop table tahan panas\nCustom ukuran & layout\nTermasuk instalasi",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    visible: true,
  },
];

// ─── MAIN SEEDER FUNCTION ────────────────────────────────────────────────────

export interface SeederProgress {
  step: number;
  total: number;
  label: string;
  done: boolean;
  error?: string;
}

export async function runSeeder(
  onProgress: (p: SeederProgress) => void,
  forceOverwrite = false
): Promise<{ success: boolean; message: string }> {
  const steps = [
    "Pengaturan umum & halaman home",
    "Konten halaman Tentang Kami",
    "Gambar utama kategori layanan",
    "Sub-layanan (9 item)",
    "Produk contoh (4 item)",
  ];
  const total = steps.length;

  const report = (step: number, label: string, done = false, error?: string) =>
    onProgress({ step, total, label, done, error });

  try {
    // ── Step 1: settings/main ────────────────────────────────────────────────
    report(1, steps[0]);
    const mainSnap = await getDocs(collection(db, "settings"));
    const mainExists = mainSnap.docs.some(d => d.id === "main");
    if (!mainExists || forceOverwrite) {
      await setDoc(doc(db, "settings", "main"), DEFAULT_MAIN_SETTINGS, { merge: true });
    }
    report(1, steps[0], true);

    // ── Step 2: settings/about ───────────────────────────────────────────────
    report(2, steps[1]);
    const aboutSnap = await getDocs(collection(db, "settings"));
    const aboutExists = aboutSnap.docs.some(d => d.id === "about");
    if (!aboutExists || forceOverwrite) {
      await setDoc(doc(db, "settings", "about"), DEFAULT_ABOUT_SETTINGS, { merge: true });
    }
    report(2, steps[1], true);

    // ── Step 3: settings/layanan-images ─────────────────────────────────────
    report(3, steps[2]);
    const imgSnap = await getDocs(collection(db, "settings"));
    const imgExists = imgSnap.docs.some(d => d.id === "layanan-images");
    if (!imgExists || forceOverwrite) {
      await setDoc(doc(db, "settings", "layanan-images"), DEFAULT_LAYANAN_IMAGES, { merge: true });
    }
    report(3, steps[2], true);

    // ── Step 4: layanan collection ───────────────────────────────────────────
    report(4, steps[3]);
    const layananSnap = await getDocs(collection(db, "layanan"));
    if (layananSnap.empty || forceOverwrite) {
      if (forceOverwrite && !layananSnap.empty) {
        // Hapus existing dulu
        for (const d of layananSnap.docs) {
          await deleteDoc(d.ref);
        }
      }
      for (const item of DEFAULT_LAYANAN_ITEMS) {
        await addDoc(collection(db, "layanan"), { ...item, createdAt: serverTimestamp() });
      }
    }
    report(4, steps[3], true);

    // ── Step 5: products collection ──────────────────────────────────────────
    report(5, steps[4]);
    const prodSnap = await getDocs(collection(db, "products"));
    if (prodSnap.empty || forceOverwrite) {
      if (forceOverwrite && !prodSnap.empty) {
        for (const d of prodSnap.docs) {
          await deleteDoc(d.ref);
        }
      }
      for (const item of DEFAULT_PRODUCTS) {
        await addDoc(collection(db, "products"), { ...item, createdAt: serverTimestamp() });
      }
    }
    report(5, steps[4], true);

    return { success: true, message: "Semua data default berhasil diisi!" };
  } catch (e: any) {
    console.error("Seeder error:", e);
    return { success: false, message: e?.message || "Terjadi kesalahan saat mengisi data." };
  }
}