# PANDUAN EDIT WEBSITE DIEGMA

Dokumen ini berisi panduan langkah demi langkah untuk melakukan berbagai perubahan pada website DIEGMA. Panduan ini dibuat untuk memudahkan admin/pemilik website dalam melakukan perubahan konten maupun tampilan tanpa perlu pengetahuan teknis yang mendalam.

## Daftar Isi
1. [Pengaturan Awal](#pengaturan-awal)
2. [Struktur Website](#struktur-website)
3. [Cara Mengedit Gambar](#cara-mengedit-gambar)
4. [Cara Mengedit Teks](#cara-mengedit-teks) 
5. [Menambah/Mengedit Proyek](#menambahmengedit-proyek)
6. [Menambah/Mengedit Layanan](#menambahmengedit-layanan)
7. [Kustomisasi Tampilan](#kustomisasi-tampilan)
8. [Konfigurasi Dark Mode](#konfigurasi-dark-mode)
9. [Panduan SEO](#panduan-seo)

---

## Pengaturan Awal

Sebelum melakukan perubahan pada website, sebaiknya siapkan lingkungan pengembangan lokal:

### 1. Mengunduh Kode

```bash
# Clone repository dari GitHub
git clone https://github.com/username/diegma-website.git

# Masuk ke direktori project
cd diegma-website

# Install dependencies
npm install
```

### 2. Menjalankan Website Lokal

```bash
# Jalankan server development
npm run dev
```

Setelah perintah di atas, website akan berjalan di `http://localhost:5000`

---

## Struktur Website

Website DIEGMA terdiri dari beberapa halaman utama:

1. **Beranda (Home)** - `client/src/pages/home.tsx`
2. **Tentang Kami (About)** - `client/src/pages/about.tsx`
3. **Proyek (Projects)** - `client/src/pages/projects.tsx` dan `client/src/pages/project/[id].tsx`
4. **Layanan (Services)** - `client/src/pages/services.tsx` dan `client/src/pages/service/[id].tsx`
5. **Kontak (Contact)** - `client/src/pages/contact.tsx`
6. **Tim (Team)** - `client/src/pages/team.tsx`

Komponen-komponen penting:

- **Header/Navbar** - `client/src/components/layout/navbar.tsx`
- **Footer** - `client/src/components/layout/footer.tsx`
- **Hero Section** - `client/src/components/sections/hero.tsx`
- **Services Section** - `client/src/components/sections/services.tsx`
- **Projects Section** - `client/src/components/sections/projects.tsx`
- **Contact Form** - `client/src/components/sections/contact-form.tsx`

---

## Cara Mengedit Gambar

### 1. Menyiapkan Gambar

- Format gambar: JPG, PNG, atau WebP (disarankan WebP untuk performa terbaik)
- Ukuran yang direkomendasikan:
  - Hero/Banner: 1920x1080px
  - Project thumbnails: 800x600px 
  - Team photos: 400x400px (ideal 1:1)
- Optimasi gambar: Gunakan tools seperti [TinyPNG](https://tinypng.com/) untuk mengompres gambar

### 2. Mengganti Gambar Hero

```tsx
// File: client/src/components/sections/hero.tsx

// Ubah URL gambar
<div className="relative h-[80vh] w-full overflow-hidden">
  <OptimizedImage 
    src="https://example.com/path-to-your-new-image.jpg" // Ganti dengan URL gambar baru
    alt="DIEGMA Architecture Studio" 
    fill 
    priority
    className="object-cover"
  />
</div>
```

### 3. Mengganti Gambar di Galeri Proyek

```tsx
// File: client/src/pages/projects.tsx

const projects = [
  {
    id: 1,
    title: "Modern House Project",
    // Ganti URL gambar di sini
    image: "https://example.com/path-to-new-project-image.jpg",
    // Data lainnya...
  },
  // Proyek lainnya...
];
```

### 4. Mengganti Foto Tim

```tsx
// File: client/src/pages/team.tsx

const teamMembers = [
  {
    id: 1,
    name: "Nama Anggota Tim",
    role: "Jabatan/Posisi",
    // Ganti URL foto tim di sini
    image: "https://example.com/path-to-new-team-photo.jpg",
    // Data lainnya...
  },
  // Anggota tim lainnya...
];
```

### 5. Menggunakan Gambar Lokal

Untuk menggunakan gambar lokal, letakkan gambar di folder `public/images/` lalu gunakan seperti ini:

```tsx
<OptimizedImage 
  src="/images/nama-file-gambar.jpg" // Path relatif dari folder public
  alt="Deskripsi Gambar" 
  width={800}
  height={600}
/>
```

---

## Cara Mengedit Teks

### 1. Mengedit Teks pada Navbar

```tsx
// File: client/src/components/layout/navbar.tsx

// Ubah teks menu
const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" }, // Ganti label jika perlu
  { label: "Proyek", href: "/projects" },
  { label: "Layanan", href: "/services" },
  { label: "Kontak", href: "/contact" },
];
```

### 2. Mengedit Teks Hero

```tsx
// File: client/src/components/sections/hero.tsx

// Ubah judul dan subtitle
<div className="hero-content text-center text-white">
  <h1 className="text-5xl font-bold mb-4">
    DIEGMA Arsitektur & Interior
  </h1>
  <p className="text-xl mb-8">
    Wujudkan Ruang Impian Anda Bersama Kami
  </p>
  {/* Konten lainnya */}
</div>
```

### 3. Mengedit Teks Tentang Kami

```tsx
// File: client/src/pages/about.tsx

// Ubah deskripsi perusahaan
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-6">Tentang Studio Kami</h2>
    <p className="text-gray-700 mb-6">
      DIEGMA adalah studio arsitektur dan desain interior yang... 
      {/* Ubah teks deskripsi di sini */}
    </p>
    {/* Konten lainnya */}
  </div>
</section>
```

### 4. Mengedit Footer

```tsx
// File: client/src/components/layout/footer.tsx

// Ubah informasi kontak
<div className="text-sm">
  <p className="mb-2">Jl. Contoh No. 123, Jakarta</p> {/* Ubah alamat */}
  <p className="mb-2">Email: info@diegma.com</p> {/* Ubah email */}
  <p>Phone: +62 821 1234 5678</p> {/* Ubah nomor telepon */}
</div>
```

---

## Menambah/Mengedit Proyek

### 1. Menambah Proyek Baru

```tsx
// File: client/src/pages/projects.tsx

// Tambahkan objek baru dalam array projects
const projects = [
  // Proyek yang sudah ada
  // ...
  
  // Proyek baru
  {
    id: 4, // Pastikan ID unik (lebih besar dari ID yang sudah ada)
    title: "Judul Proyek Baru",
    category: "Residensial",
    type: "residential", // Pilih dari: "residential", "commercial", "interior"
    image: "https://example.com/path-to-project-image.jpg",
    description: "Deskripsi lengkap tentang proyek baru ini...",
    location: "Jakarta",
    year: "2025"
  }
];
```

### 2. Mengubah Detail Proyek

```tsx
// File: client/src/pages/project/[id].tsx

// Data detail proyek (temukan proyek yang ingin diubah berdasarkan ID)
const projectsData = [
  {
    id: 1,
    title: "Modern House Project", // Ubah judul
    category: "Residensial",
    client: "Nama Klien", // Ubah nama klien
    location: "Jakarta Selatan", // Ubah lokasi
    year: "2023", // Ubah tahun
    description: "Proyek ini merupakan...", // Ubah deskripsi
    images: [
      "https://example.com/image1.jpg", // Ganti/tambah URL gambar
      "https://example.com/image2.jpg",
      // Tambahkan lebih banyak gambar jika perlu
    ],
    challenges: "Tantangan dalam proyek ini...", // Ubah deskripsi tantangan
    solutions: "Solusi yang kami terapkan...", // Ubah deskripsi solusi
  },
  // Proyek lainnya...
];
```

---

## Menambah/Mengedit Layanan

### 1. Menambah Kategori Layanan Baru

```tsx
// File: client/src/pages/services.tsx

// Tambahkan objek baru dalam array serviceCategories
const serviceCategories = [
  // Kategori yang sudah ada
  // ...
  
  // Kategori baru
  {
    id: "landscape", // ID unik untuk kategori
    title: "Desain Lansekap",
    description: "Layanan desain lansekap untuk penataan ruang luar...",
    icon: <PalmTree className="h-6 w-6" />, // Pilih ikon dari Lucide React
    image: "https://example.com/path-to-landscape-image.jpg",
    benefits: [
      "Penataan taman yang estetis",
      "Pemilihan tanaman yang tepat",
      "Perencanaan sistem irigasi efisien",
      "Desain area outdoor yang fungsional"
    ],
    services: [
      {
        id: 1,
        title: "Desain Taman Rumah",
        description: "Layanan desain taman untuk rumah tinggal...",
        image: "https://example.com/path-to-garden-image.jpg"
      },
      // Tambahkan layanan lainnya dalam kategori ini
    ]
  }
];
```

### 2. Mengubah Detail Layanan

```tsx
// File: client/src/pages/service/[id].tsx

// Data detail layanan (temukan layanan yang ingin diubah berdasarkan ID)
const serviceData = {
  "interior-exterior": {
    title: "Desain Interior & Eksterior", // Ubah judul
    description: "Layanan desain komprehensif untuk menciptakan ruang...", // Ubah deskripsi
    processSteps: [
      {
        title: "Konsultasi Awal", // Ubah judul tahapan
        description: "Kami akan berdiskusi tentang kebutuhan dan preferensi Anda...", // Ubah deskripsi tahapan
        icon: <Users className="h-8 w-8" /> // Ganti ikon jika perlu
      },
      // Tahapan lainnya...
    ],
    serviceItems: [
      // Detail layanan dalam kategori
    ],
    faq: [
      {
        question: "Berapa lama waktu yang dibutuhkan untuk proyek desain interior?", // Ubah pertanyaan
        answer: "Waktu yang dibutuhkan bervariasi tergantung pada kompleksitas..." // Ubah jawaban
      },
      // FAQ lainnya...
    ]
  },
  // Layanan lainnya...
};
```

---

## Kustomisasi Tampilan

### 1. Mengubah Warna Tema

```css
/* File: client/src/index.css */

/* Ubah variabel warna utama */
:root {
  --primary: 45 100% 50%;          /* Warna emas (#FFD700) */
  --primary-foreground: 220 5% 20%; /* Warna teks pada latar belakang utama */
  
  /* Warna lainnya */
  /* ... */
}
```

### 2. Mengubah Font

1. Tambahkan font baru di `client/index.html`:

```html
<!-- Ganti URL font Google dengan font yang diinginkan -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=NamaFont:wght@300;400;500;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

2. Update CSS di `client/src/index.css`:

```css
/* Ubah font-family default */
body {
  font-family: 'NamaFont', sans-serif; /* Ganti dengan nama font baru */
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'NamaFont', sans-serif; /* Ganti dengan nama font baru */
  font-weight: 700;
}
```

### 3. Mengubah Animasi

```tsx
// File: client/src/components/sections/projects.tsx

// Ubah animasi untuk kartu proyek
<motion.div 
  initial={{ opacity: 0, y: 50 }} // Ubah nilai awal animasi
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ 
    duration: 0.8, // Ubah durasi animasi
    delay: index * 0.1, // Ubah delay antara item
    type: "spring",
    stiffness: 60 // Ubah kekakuan animasi spring
  }}
>
  {/* Konten kartu */}
</motion.div>
```

---

## Konfigurasi Dark Mode

### 1. Menyesuaikan Warna Dark Mode

```css
/* File: client/src/index.css */

/* Ubah variabel untuk tema gelap */
.dark {
  --background: 222 47% 11%;      /* Warna latar belakang (#0f172a) */
  --foreground: 214 32% 91%;      /* Warna teks (#e2e8f0) */
  --card: 222 47% 15%;            /* Warna kartu (#1e293b) */
  --card-foreground: 214 32% 91%; /* Warna teks pada kartu */
  
  /* Warna lainnya */
  /* ... */
}
```

### 2. Menambahkan Komponen dengan Dukungan Dark Mode

```tsx
// Contoh menambahkan komponen dengan dukungan dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-md">
  <h3 className="text-xl font-bold mb-4">Judul Komponen</h3>
  <p className="text-gray-700 dark:text-gray-300">
    Deskripsi komponen ini...
  </p>
</div>
```

---

## Panduan SEO

### 1. Mengubah Metadata Halaman

```tsx
// File: client/src/pages/about.tsx

// Ubah metadata untuk halaman Tentang Kami
<SEO
  title="Tentang DIEGMA | Studio Arsitektur & Desain Interior Premium Jakarta"
  description="DIEGMA adalah studio arsitektur dan desain interior premium di Jakarta yang fokus pada desain modern, fungsional, dan berkelanjutan untuk hunian dan komersial."
  canonicalUrl="https://www.diegma.com/about"
  ogImage="https://www.diegma.com/images/about-og.jpg"
/>
```

### 2. Menambahkan Structured Data

```tsx
// File: client/src/pages/services.tsx

// Tambahkan data terstruktur untuk halaman layanan
<SEO
  title="Layanan Desain & Arsitektur | DIEGMA Studio Jakarta"
  description="Kami menawarkan layanan lengkap desain interior, arsitektur, dan konstruksi dengan pendekatan modern dan inovatif untuk rumah, apartemen, dan kantor."
  structuredData={generateServiceSchema({
    name: "Layanan Desain Interior & Arsitektur DIEGMA",
    description: "Layanan desain interior profesional untuk proyek residensial dan komersial",
    provider: {
      name: "DIEGMA Studio",
      image: "https://www.diegma.com/logo.png"
    },
    serviceType: "Interior Design",
    areaServed: "Jakarta"
  })}
/>
```

### 3. Optimasi Gambar untuk SEO

- Selalu gunakan atribut `alt` yang deskriptif:

```tsx
<OptimizedImage
  src="/images/project-modern-house.jpg"
  alt="Desain rumah modern minimalis dengan pencahayaan alami di Jakarta Selatan" // Alt yang deskriptif
  width={800}
  height={600}
/>
```

---

## Kesimpulan

Panduan ini mencakup dasar-dasar pengeditan website DIEGMA. Jika Anda memerlukan bantuan lebih lanjut atau ada pertanyaan, hubungi tim pengembang kami:

- Email: support@diegma.com
- WhatsApp: +6285703178423

---

*Dokumen ini dibuat pada: 6 Mei 2025*