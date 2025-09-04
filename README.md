# Budget Tracker API

Backend service untuk aplikasi manajemen keuangan pribadi.  
Dibangun menggunakan **Express.js** dengan **TypeScript**, **PostgreSQL** sebagai database, dan **Prisma ORM** untuk akses data.  
Autentikasi menggunakan **JWT** dengan **HTTP-only cookie** untuk keamanan.

---

## ✨ Fitur Utama

### 🔐 Autentikasi

- **Register** akun baru
- **Login** dengan JWT + HTTP-only cookie
- **Logout** (hapus cookie session)

### 💰 Transaction

- **Tambah transaksi** (pemasukan / pengeluaran)
- **Get all transaksi**
- **Hapus transaksi**

### 👤 Profile

- **Get profile** pengguna yang sedang login

### 📊 Summary

- **Saldo terakhir**
- **Total pemasukan** (Rupiah)
- **Total pengeluaran** (Rupiah)

---

## 🛠️ Teknologi

- [Express.js](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/) untuk autentikasi
- [Cookie HTTP-only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) untuk keamanan session

---

## ⚙️ Setup Lokal

### 1. Clone repo

```bash
git clone https://github.com/username/Budget-Tracker-API.git
cd finance-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Buat file .env di root project:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/finance_db?schema=public"

# JWT
JWT_SECRET="super_secret_key"
JWT_EXPIRES_IN="1h"

# Server
PORT=5000
```

### 4. Setup database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run server

```bash
npm run dev
```

Server akan berjalan di: http://localhost:5000

---

## 🚀 Deployment

### Lokal (default)

- Jalankan dengan `npm run dev` untuk pengembangan
- Jalankan dengan `npm run build && npm start` untuk production

### Docker

Buat file `Dockerfile`:

```bash
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]
```

Lalu jalankan:

```bash
docker build -t finance-backend .
docker run -p 5000:5000 finance-backend
```

### Docker

- Vercel lebih cocok untuk frontend, tetapi bisa dipakai untuk backend kecil.
- Alternatif: gunakan Vercel serverless function atau deploy dengan Railway / Render / Google Cloud Run untuk backend dengan database.

---

## 📖 Catatan

- Gunakan HTTP-only cookie agar token tidak bisa diakses JavaScript (lebih aman terhadap XSS).
- Untuk production, pastikan `JWT_SECRET` menggunakan string panjang dan sulit ditebak.
- Bisa ditambahkan rate limiter dan CORS configuration untuk keamanan tambahan.

---

## 🧑‍💻 Author

Dibuat oleh [mubasyir19](https://github.com/mubasyir19)
