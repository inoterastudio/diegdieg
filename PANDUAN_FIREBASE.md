# 🔥 PANDUAN SETUP FIREBASE — DIEGMA Admin Panel

## LANGKAH 1: Buat Proyek Firebase

1. Buka **https://console.firebase.google.com/**
2. Klik **"Add project"** / **"Tambahkan Proyek"**
3. Masukkan nama proyek: **diegma-website** (atau nama apapun)
4. Klik **Continue** → matikan Google Analytics jika tidak diperlukan → **Create project**
5. Tunggu hingga selesai, lalu klik **Continue**

---

## LANGKAH 2: Daftarkan Web App

1. Di halaman project, klik ikon **`</>`** (Web)
2. App nickname: **diegma-web**
3. **Jangan** centang Firebase Hosting
4. Klik **Register app**
5. Anda akan melihat kode seperti ini:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "diegma-website.firebaseapp.com",
  projectId: "diegma-website",
  storageBucket: "diegma-website.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. **Copy nilai-nilai tersebut** lalu paste ke file:
   `client/src/lib/firebase.ts`

---

## LANGKAH 3: Aktifkan Authentication

1. Di sidebar kiri, klik **Build → Authentication**
2. Klik **Get started**
3. Pilih tab **Sign-in method**
4. Klik **Email/Password**
5. Toggle **Enable** → Klik **Save**

### Buat Akun Admin:
1. Klik tab **Users**
2. Klik **Add user**
3. Masukkan email dan password Anda (ini yang digunakan untuk login admin)
4. Klik **Add user**

---

## LANGKAH 4: Aktifkan Firestore Database

1. Di sidebar kiri, klik **Build → Firestore Database**
2. Klik **Create database**
3. Pilih **Start in production mode** → Klik **Next**
4. Pilih region terdekat (misal: `asia-southeast1` untuk Indonesia) → Klik **Enable**

### Atur Rules Firestore:
1. Klik tab **Rules**
2. Ganti semua isinya dengan ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

---

## LANGKAH 5: Aktifkan Storage

1. Di sidebar kiri, klik **Build → Storage**
2. Klik **Get started**
3. Klik **Next** → **Done**

### Atur Rules Storage:
1. Klik tab **Rules**
2. Ganti isinya dengan:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

---

## LANGKAH 6: Install Firebase di Project

Buka terminal di folder project, jalankan:

```bash
npm install
```

(Firebase sudah ditambahkan ke package.json secara otomatis)

---

## LANGKAH 7: Jalankan dan Login

1. Jalankan: `npm run dev`
2. Buka: `http://localhost:5000/diegma-panel`
3. Login dengan email & password yang dibuat di Langkah 3

---

## 🔑 URL Admin Panel

URL tersembunyi admin panel:
```
https://domain-anda.com/diegma-panel
```

URL ini tidak ada di navbar, jadi hanya Anda yang tahu.

---

## ✅ Selesai!

Setelah login, Anda bisa:
- **Kelola Produk** → tambah/edit/hapus produk
- **Kelola Layanan** → tambah/edit/hapus layanan
- **Kelola Proyek** → kelola proyek (tersembunyi di web)
- **Kelola Tim** → tambah/edit/hapus anggota tim
- **Pesan Masuk** → lihat semua pesan dari form kontak
- **Pengaturan** → ubah nomor WA, kontak, konten, password
