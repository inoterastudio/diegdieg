# PANDUAN DEPLOYMENT WEBSITE DIEGMA

Berikut adalah panduan lengkap untuk proses deployment website DIEGMA ke berbagai platform hosting.

## Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Push ke GitHub](#push-ke-github)
3. [Deployment ke Netlify](#deployment-ke-netlify)
4. [Deployment ke Vercel](#deployment-ke-vercel) 
5. [Deployment ke Hosting DomaiNesia](#deployment-ke-hosting-domainesia)
6. [Integrasi Database](#integrasi-database)
7. [Panduan Edit Website](#panduan-edit-website)

---

## Persiapan Awal

Berikut langkah persiapan yang perlu dilakukan sebelum melakukan deployment:

### 1. Pastikan semua dependencies terinstall

```bash
# Pastikan Anda berada di folder root project
npm install
```

### 2. Pastikan tidak ada error di aplikasi

```bash
# Jalankan aplikasi di mode development untuk melihat error
npm run dev
```

### 3. Build aplikasi untuk production

```bash
# Build aplikasi untuk production
npm run build
```

### 4. Pastikan Anda memiliki Node.js dan npm versi terbaru

```bash
# Cek versi Node.js
node -v
# Sebaiknya gunakan Node.js versi 18.x atau lebih baru

# Cek versi npm
npm -v
```

---

## Push ke GitHub

Langkah-langkah untuk push kode ke GitHub:

### 1. Buat repository di GitHub

1. Buka [GitHub](https://github.com) dan login ke akun Anda
2. Klik tombol "New" untuk membuat repository baru
3. Beri nama repository (misalnya: "diegma-website")
4. Pilih visibility (Public atau Private)
5. Klik "Create repository"

### 2. Inisialisasi Git di project Anda

```bash
# Jika belum ada git, inisialisasi git di folder project
git init

# Tambahkan semua file ke staging
git add .

# Commit perubahan
git commit -m "Initial commit"

# Tambahkan remote repository GitHub
git remote add origin https://github.com/username/diegma-website.git

# Push ke GitHub
git push -u origin main
```

> **Catatan**: Ganti `username` dengan username GitHub Anda dan `diegma-website` dengan nama repo yang Anda buat.

---

## Deployment ke Netlify

Netlify menyediakan hosting gratis dengan SSL dan CI/CD otomatis. Berikut cara deploy ke Netlify:

### 1. Persiapan

Pastikan file `netlify.toml` sudah ada di root project dengan isi:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deployment melalui Netlify UI

1. Buka [Netlify](https://app.netlify.com/) dan login/daftar akun
2. Klik "New site from Git"
3. Pilih "GitHub" sebagai penyedia Git
4. Pilih repository yang telah Anda push
5. Di bagian Basic build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Klik "Deploy site"

### 3. Konfigurasi Domain Kustom di Netlify

1. Buka dashboard situs Anda di Netlify
2. Klik tab "Domain settings"
3. Klik "Add custom domain"
4. Masukkan domain Anda (misal: diegma.com)
5. Ikuti instruksi untuk memverifikasi kepemilikan dan mengatur DNS

### 4. Konfigurasi Environment Variables (Jika Menggunakan Firebase/Supabase)

1. Buka dashboard situs Anda di Netlify
2. Klik tab "Site settings"
3. Pilih "Environment variables"
4. Tambahkan variabel yang diperlukan (misalnya `VITE_FIREBASE_API_KEY`, `VITE_SUPABASE_URL`, dll.)

---

## Deployment ke Vercel

Vercel sangat cocok untuk hosting situs Next.js, React, Vue, dan berbagai framework frontend lainnya:

### 1. Persiapan

Pastikan file `vercel.json` ada di root project dengan isi:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Deployment melalui Vercel UI

1. Buka [Vercel](https://vercel.com/) dan login/daftar akun
2. Klik "New Project"
3. Pilih "Import Git Repository" dan hubungkan dengan GitHub
4. Pilih repository yang telah Anda push
5. Konfigurasi:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Klik "Deploy"

### 3. Konfigurasi Domain Kustom di Vercel

1. Buka dashboard project Anda di Vercel
2. Klik tab "Settings" lalu "Domains"
3. Tambahkan domain kustom Anda
4. Ikuti petunjuk untuk mengatur DNS atau transfer domain

### 4. Konfigurasi Environment Variables

1. Buka dashboard project Anda di Vercel
2. Klik tab "Settings" lalu "Environment Variables"
3. Tambahkan variabel yang diperlukan (misalnya `VITE_FIREBASE_API_KEY`, `VITE_SUPABASE_URL`, dll.)

---

## Deployment ke Hosting DomaiNesia

DomaiNesia merupakan layanan hosting Indonesia yang menawarkan shared hosting, VPS, dan dedicated server:

### 1. Persiapan

1. Daftar/login ke akun DomaiNesia
2. Beli paket hosting yang sesuai (minimal paket dengan dukungan Node.js)
3. Persiapkan file hasil build (`npm run build`) yang akan di-upload

### 2. Upload File via FTP

1. Masuk ke cPanel DomaiNesia
2. Gunakan File Manager atau FTP (dengan software seperti FileZilla)
3. Koneksi FTP:
   - Host: ftp.domainanda.com (ganti sesuai informasi dari DomaiNesia)
   - Username: username FTP Anda
   - Password: password FTP Anda
   - Port: 21
4. Upload semua file dari folder `dist` ke public_html

### 3. Konfigurasi .htaccess untuk SPA

Buat file `.htaccess` di folder public_html dengan isi:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 4. Konfigurasi Node.js di DomaiNesia (Jika menggunakan server API)

1. Masuk ke cPanel DomaiNesia
2. Buka "Setup Node.js App"
3. Buat aplikasi baru dengan:
   - Node.js version: Pilih versi terbaru
   - Application mode: Production
   - Application root: Folder tempat Anda upload kode server
   - Application URL: URL untuk mengakses API
   - Application startup file: server/index.ts
4. Klik "Create"

---

## Integrasi Database

### Menggunakan Firebase

#### 1. Persiapan Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru (atau pilih yang sudah ada)
3. Tambahkan aplikasi web (klik ikon </> )
4. Salin konfigurasi Firebase

#### 2. Integrasi dengan Project

Buat file `src/lib/firebase.ts` dengan konfigurasi:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

#### 3. Tambahkan Environment Variables di Hosting

Tambahkan semua variabel yang dimulai dengan `VITE_FIREBASE_` ke environment variables di Netlify/Vercel.

### Menggunakan Supabase

#### 1. Persiapan Supabase

1. Buka [Supabase](https://app.supabase.io/) dan login/daftar
2. Buat project baru
3. Dapatkan URL dan anon key dari Settings > API

#### 2. Integrasi dengan Project

Buat file `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 3. Tambahkan Environment Variables di Hosting

Tambahkan variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ke environment variables di Netlify/Vercel.

---

## Panduan Edit Website

### Struktur Project

Project website DIEGMA memiliki struktur sebagai berikut:

```
├── client/                 # Kode frontend
│   ├── src/                # Source code utama
│   │   ├── components/     # Komponen React
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Fungsi dan utilitas
│   │   ├── pages/          # Halaman utama
│   │   └── ...
│   └── ...
├── server/                 # Kode backend
├── shared/                 # Kode yang digunakan bersama frontend & backend
└── ...
```

### Cara Edit Konten

#### 1. Mengganti Gambar

Untuk mengganti gambar pada website:

1. Siapkan gambar dengan ukuran yang sesuai (disarankan gambar berkualitas tinggi)
2. Ganti file gambar di direktori yang sesuai atau gunakan URL gambar baru
3. Edit file komponen yang menggunakan gambar tersebut

Contoh penggantian gambar hero di halaman utama:

```jsx
// Lokasi: client/src/components/sections/hero.tsx

// Ganti URL gambar ini
<OptimizedImage 
  src="https://images.unsplash.com/new-image-url-here" 
  alt="DIEGMA Hero" 
  className="w-full h-full object-cover"
  priority
/>
```

#### 2. Mengedit Teks

Untuk mengedit teks pada website, cari bagian teks di file komponen yang sesuai:

Contoh di halaman About:

```jsx
// Lokasi: client/src/pages/about.tsx

// Edit teks dalam elemen ini
<h2 className="text-3xl font-bold mb-6">Tentang Studio Kami</h2>
<p className="text-gray-700 mb-6">
  // Ganti dengan teks yang baru
  DIEGMA adalah studio arsitektur dan desain interior yang...
</p>
```

#### 3. Menambah/Mengedit Proyek

Proyek ditampilkan dalam array di beberapa file. Untuk menambah/mengedit:

```jsx
// Lokasi: client/src/pages/projects.tsx

// Tambah atau edit item dalam array ini
const projects = [
  {
    id: 1,
    title: "Judul Proyek Baru",  // Edit judul
    category: "Residensial",     // Ganti kategori
    type: "residential",
    image: "https://images.unsplash.com/new-project-image", // Ganti gambar
    description: "Deskripsi proyek baru Anda", // Edit deskripsi
    location: "Jakarta Selatan",
    year: "2025"
  },
  // Proyek lainnya...
];
```

#### 4. Menambah/Mengedit Layanan

Sama seperti proyek, layanan disimpan dalam array:

```jsx
// Lokasi: client/src/pages/services.tsx

// Edit array kategori layanan ini
const serviceCategories = [
  {
    id: "interior-exterior",
    title: "Judul Layanan Baru", // Edit judul
    description: "Deskripsi layanan baru Anda", // Edit deskripsi
    // Edit komponen lainnya...
  },
  // Layanan lainnya...
];
```

### Deployment Ulang Setelah Edit

Setelah melakukan perubahan, lakukan:

1. Test perubahan di lokal: `npm run dev`
2. Commit perubahan: 
   ```bash
   git add .
   git commit -m "Update konten website"
   git push
   ```
3. Deployment akan otomatis terjadi di Netlify/Vercel jika sudah terhubung dengan Git

---

## Troubleshooting

Berikut solusi untuk masalah umum yang mungkin terjadi:

### 1. Error saat build

Jika terjadi error saat build:

```bash
# Cek versi Node.js dan npm
node -v
npm -v

# Clear cache
npm cache clean --force

# Install ulang dependencies
rm -rf node_modules
npm install

# Coba build ulang
npm run build
```

### 2. CORS error saat mengakses API

Jika terjadi CORS error:

- Pastikan server backend mengizinkan origin frontend
- Tambahkan header CORS yang sesuai di server

### 3. Database tidak terhubung

- Cek konfigurasi environment variables
- Verifikasi kredensial Firebase/Supabase
- Cek apakah rules database mengizinkan akses

---

## Support dan Bantuan

Jika Anda mengalami kesulitan atau memiliki pertanyaan tentang deployment website DIEGMA, hubungi:

- Email: support@diegma.com
- WhatsApp: +6285703178423

---

*Dokumen ini dibuat pada: 6 Mei 2025*