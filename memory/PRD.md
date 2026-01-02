# Fahmy Web3 Portfolio - Product Requirements Document

## Original Problem Statement
User (Fahmy) meminta website portfolio personal untuk Web3/Blockchain space dengan fitur:
- Tema gelap modern dengan aksen hijau neon
- Section publik: hero, experience, research/publications, node validators
- Blog dengan preview di homepage dan halaman full blog
- Form kontak
- Admin panel tersembunyi untuk mengelola semua konten
- Upload gambar untuk blog, research, dan validators
- Background animasi blockchain untuk hero section
- Detail page untuk blog dan research

## User Persona
- **Nama**: Fahmy
- **Role**: Web3 Researcher & Node Validator
- **Email**: fahmyfarda@gmail.com
- **Lokasi**: Indonesia
- **Kebutuhan**: Website portfolio profesional untuk menampilkan karya dan keahlian di bidang blockchain

## Core Requirements
1. ✅ Website portfolio dengan tema gelap + aksen hijau neon
2. ✅ Hero section dengan animasi blockchain
3. ✅ Experience section
4. ✅ Research & Papers section dengan halaman detail
5. ✅ Node Validators section
6. ✅ Blog dengan preview dan halaman listing
7. ✅ Blog detail page untuk setiap artikel
8. ✅ Contact form (dengan EmailJS - perlu API keys dari user)
9. ✅ Admin panel tersembunyi (/fahmy-secure-auth, /fahmy-control-panel)
10. ✅ Upload gambar dan tampilan di website publik

## Tech Stack
- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based untuk admin

## Architecture
```
/app
├── backend/
│   ├── server.py       # FastAPI main app, routes, dan logic
│   ├── models.py       # Pydantic models untuk DB
│   ├── seed_data.py    # Data awal untuk seeding
│   └── uploads/        # Folder untuk file yang diupload
└── frontend/
    └── src/
        ├── components/   # Reusable UI components
        ├── contexts/     # AuthContext untuk session
        ├── data/         # DataContext untuk state global
        ├── pages/        # Page components
        └── services/     # API calls
```

## API Endpoints
- `POST /api/auth/login` - Login admin
- `GET /api/profile` - Get profile publik
- `PUT /api/profile` - Update profile (protected)
- `GET/POST/PUT/DELETE /api/experiences/{id}` - CRUD experiences
- `GET/POST/PUT/DELETE /api/research/{id}` - CRUD research
- `GET/POST/PUT/DELETE /api/validators/{id}` - CRUD validators  
- `GET/POST/PUT/DELETE /api/posts/{id}` - CRUD blog posts
- `POST /api/upload` - Upload file (protected)
- `GET /api/uploads/{filename}` - Serve uploaded files

## Admin Credentials
- **Email**: fahmy@admin.com
- **Password**: admin123
- **Login URL**: /fahmy-secure-auth
- **Dashboard URL**: /fahmy-control-panel

## Status: MVP COMPLETE ✅

### Completed (Jan 2, 2026)
- [x] Full-stack portfolio website
- [x] Semua section publik
- [x] Admin panel dengan CRUD untuk semua konten
- [x] Upload gambar dan tampilan di website
- [x] Blog detail page
- [x] Research detail page
- [x] Email penerima diset ke fahmyfarda@gmail.com
- [x] Navigasi scroll ke top untuk halaman blog
- [x] Semua kartu clickable dengan navigasi proper

## Pending/Blocked Items
1. **Contact Form** (P2) - Menunggu user menyediakan API keys EmailJS:
   - Service ID
   - Template ID  
   - Public Key
   - User perlu buat akun di https://www.emailjs.com/

## Future Enhancements (Backlog)
- Social sharing untuk blog posts
- SEO optimization (meta tags, sitemap)
- Analytics integration
- Newsletter subscription
- Multi-language support
