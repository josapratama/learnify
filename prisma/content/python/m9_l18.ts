export const lesson18 = `
# Membangun Web Backend dengan Python

Sekarang kita sudah tahu cara ambil data dari API orang lain. Bagaimana kalau kita yang buat API-nya sendiri?

Itulah **backend development** — membangun server yang bisa menerima request, memproses data, dan mengembalikan response. Python punya beberapa framework populer untuk ini, dan kita akan bahas dua yang paling relevan saat ini.

---

## 🤔 Pilih Framework yang Tepat

| Framework | Karakter | Cocok Untuk |
|-----------|----------|-------------|
| **Flask** | Ringan, fleksibel, mudah dipelajari | Mulai cepat, microservice, belajar |
| **FastAPI** | Modern, cepat, type-safe, async | API production, butuh performa |
| **Django** | Full-stack, banyak fitur bawaan | Aplikasi web lengkap, CMS |

Kita fokus ke **FastAPI** karena ini tren terkini — type-safe, async by default, dan punya dokumentasi API otomatis yang sangat membantu.

---

## 🧪 Flask — Cara Paling Cepat Mulai

\`\`\`bash
pip install flask
\`\`\`

\`\`\`python
# app.py — Flask dasar
from flask import Flask, request, jsonify

app = Flask(__name__)

# Data sementara (di produksi pakai database)
users = [
    {"id": 1, "nama": "Andi", "email": "andi@email.com"},
    {"id": 2, "nama": "Budi", "email": "budi@email.com"},
]

# Route GET sederhana
@app.route("/")
def home():
    return {"message": "Selamat datang di API saya!", "status": "OK"}

# GET semua users
@app.route("/users", methods=["GET"])
def get_users():
    return jsonify(users)

# GET user by ID
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User tidak ditemukan"}), 404

# POST buat user baru
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    
    if not data.get("nama") or not data.get("email"):
        return jsonify({"error": "nama dan email wajib diisi"}), 400
    
    user_baru = {
        "id"    : len(users) + 1,
        "nama"  : data["nama"],
        "email" : data["email"]
    }
    users.append(user_baru)
    return jsonify(user_baru), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    # Buka: http://localhost:5000
\`\`\`

---

## ⚡ FastAPI — Modern & Type-Safe

\`\`\`bash
pip install fastapi uvicorn
\`\`\`

\`\`\`python
# main.py — FastAPI dasar
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List

app = FastAPI(
    title       = "EduTech API",
    description = "API untuk platform belajar online",
    version     = "1.0.0"
)

# Model dengan Pydantic — validasi otomatis!
class UserBase(BaseModel):
    nama  : str
    email : str

class UserCreate(UserBase):
    password : str

class UserResponse(UserBase):
    id     : int
    aktif  : bool = True
    
    class Config:
        from_attributes = True  # Untuk kompatibilitas dengan ORM

# Database simulasi
db_users: List[dict] = []
id_counter = 1

@app.get("/")
async def root():
    return {"message": "EduTech API v1.0.0", "docs": "/docs"}

@app.get("/users", response_model=List[UserResponse])
async def get_all_users():
    """Ambil semua pengguna."""
    return db_users

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """Ambil pengguna berdasarkan ID."""
    user = next((u for u in db_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"User dengan ID {user_id} tidak ditemukan"
        )
    return user

@app.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """Daftarkan pengguna baru."""
    global id_counter
    
    # Cek duplikat email
    if any(u["email"] == user.email for u in db_users):
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail      = f"Email '{user.email}' sudah terdaftar"
        )
    
    # Hash password (di produksi pakai bcrypt!)
    import hashlib
    pass_hash = hashlib.sha256(user.password.encode()).hexdigest()
    
    user_baru = {
        "id"       : id_counter,
        "nama"     : user.nama,
        "email"    : user.email,
        "password" : pass_hash,
        "aktif"    : True
    }
    db_users.append(user_baru)
    id_counter += 1
    
    return user_baru

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    """Hapus pengguna."""
    user = next((u for u in db_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    db_users.remove(user)

# Jalankan dengan:
# uvicorn main:app --reload --port 8000
# Dokumentasi otomatis: http://localhost:8000/docs
\`\`\`

---

## 🗄️ Koneksi ke Database dengan SQLAlchemy

\`\`\`bash
pip install sqlalchemy
\`\`\`

\`\`\`python
# models.py — Definisi model database
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# SQLite untuk development (ganti PostgreSQL untuk produksi)
DATABASE_URL = "sqlite:///./aplikasi.db"

engine        = create_engine(DATABASE_URL)
SessionLocal  = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base          = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id         = Column(Integer, primary_key=True, index=True)
    nama       = Column(String(100), nullable=False)
    email      = Column(String(100), unique=True, index=True)
    password   = Column(String(255), nullable=False)
    aktif      = Column(Boolean, default=True)
    dibuat_pada = Column(DateTime, default=datetime.now)

# Buat tabel
Base.metadata.create_all(bind=engine)

# CRUD Operations
def buat_user(db, nama, email, password_hash):
    user = User(nama=nama, email=email, password=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def ambil_user(db, user_id):
    return db.query(User).filter(User.id == user_id).first()

def ambil_semua_user(db, skip=0, limit=100):
    return db.query(User).offset(skip).limit(limit).all()
\`\`\`

---

## 🔒 Autentikasi JWT Sederhana

\`\`\`python
# auth.py
import jwt
import bcrypt
from datetime import datetime, timedelta

SECRET_KEY = "rahasia-super-panjang-dan-aman"  # Pakai os.getenv() di produksi!
ALGORITMA  = "HS256"

def hash_password(password: str) -> str:
    """Hash password dengan bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hash: str) -> bool:
    """Verifikasi password."""
    return bcrypt.checkpw(password.encode(), hash.encode())

def buat_token(user_id: int, email: str) -> str:
    """Buat JWT token."""
    payload = {
        "sub"  : str(user_id),
        "email": email,
        "exp"  : datetime.utcnow() + timedelta(hours=24),
        "iat"  : datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITMA)

def verifikasi_token(token: str) -> dict:
    """Verifikasi dan decode JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITMA])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token sudah kadaluarsa")
    except jwt.InvalidTokenError:
        raise ValueError("Token tidak valid")
\`\`\`

---

## 📁 Struktur Proyek yang Baik

\`\`\`
my-api/
├── main.py              # Entry point
├── requirements.txt     # Dependencies
├── .env                 # Environment variables (jangan commit!)
├── app/
│   ├── __init__.py
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── routers/         # Route handlers
│   │   ├── users.py
│   │   ├── auth.py
│   │   └── courses.py
│   ├── services/        # Business logic
│   ├── database.py      # DB connection
│   └── config.py        # Configuration
└── tests/               # Unit tests
\`\`\`

---

## 📝 Ringkasan

- **Flask**: ringan, cocok untuk belajar dan microservice sederhana
- **FastAPI**: modern, cepat, validasi otomatis via Pydantic, dokumentasi API otomatis di /docs
- \`@app.get()\`, \`@app.post()\`, \`@app.put()\`, \`@app.delete()\` untuk HTTP methods
- \`HTTPException\` untuk mengembalikan error dengan status code yang tepat
- SQLAlchemy untuk ORM — interaksi database tanpa SQL mentah
- Selalu hash password, gunakan JWT untuk autentikasi
- Jalankan FastAPI dengan: \`uvicorn main:app --reload\`

> **Di modul berikutnya, kita sampai di Penutup — tips karir, proyek akhir, dan langkah selanjutnya!** 🎓
`;
