export const cyber_l7 = `
# Keamanan untuk Developer — Secure Coding

Sebagai developer, kamu tidak hanya pengguna yang perlu dilindungi dari serangan — kamu juga **pembuat sistem** yang bisa menjadi jalan masuk serangan jika tidak coding dengan aman.

Kerentanan yang kamu biarkan di kode bisa mengekspos jutaan pengguna. Ini bukan berlebihan — hampir semua kebocoran data besar berasal dari celah kode yang bisa dicegah.

---

## 🔝 OWASP Top 10 — Kerentanan Web Paling Umum

OWASP (Open Web Application Security Project) mendaftar 10 risiko keamanan web teratas. Ini adalah daftar yang harus diketahui setiap developer.

### 1. SQL Injection

\`\`\`python
# ❌ RENTAN — Jangan pernah lakukan ini!
def cari_user(email):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    # Jika email = "' OR '1'='1'; DROP TABLE users; --"
    # Query menjadi: SELECT * FROM users WHERE email = '' OR '1'='1'; DROP TABLE users; --
    # CATASTROPHIC!

# ✅ AMAN — Parameterized query
def cari_user_aman(email):
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    return cursor.fetchone()
\`\`\`

\`\`\`javascript
// ✅ AMAN di Node.js
const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]  // Parameter terpisah dari query
);
\`\`\`

### 2. XSS (Cross-Site Scripting)

\`\`\`javascript
// ❌ RENTAN — Inject HTML/JavaScript dari user input
document.getElementById('nama').innerHTML = userInput;
// Jika userInput = "<script>document.cookie</script>" → bahaya!

// ✅ AMAN — Escape atau gunakan textContent
document.getElementById('nama').textContent = userInput;

// ✅ Di React — JSX auto-escape
return <div>{userInput}</div>; // Aman secara default

// ❌ RENTAN di React
return <div dangerouslySetInnerHTML={{__html: userInput}} />;
\`\`\`

### 3. CSRF (Cross-Site Request Forgery)

\`\`\`python
# ❌ RENTAN — Tidak ada CSRF protection
@app.route('/transfer', methods=['POST'])
def transfer():
    amount = request.form['amount']
    to = request.form['to']
    do_transfer(amount, to)

# ✅ AMAN — Verifikasi CSRF token
@app.route('/transfer', methods=['POST'])
def transfer():
    token = request.form.get('csrf_token')
    if not verify_csrf_token(token):
        abort(403)
    # ... proceed
\`\`\`

### 4. Insecure Direct Object Reference (IDOR)

\`\`\`javascript
// ❌ RENTAN — User bisa akses data orang lain
app.get('/api/orders/:id', async (req, res) => {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order); // User bisa akses order siapapun dengan ganti angka di URL!
});

// ✅ AMAN — Verifikasi kepemilikan
app.get('/api/orders/:id', authenticate, async (req, res) => {
    const order = await db.query(
        'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]  // Pastikan order milik user ini
    );
    if (!order) return res.status(403).json({error: 'Forbidden'});
    res.json(order);
});
\`\`\`

---

## 🔐 Password & Authentication

\`\`\`python
# ❌ SANGAT BURUK — Simpan password plain text
def simpan_user(email, password):
    db.execute("INSERT INTO users VALUES (%s, %s)", (email, password))

# ❌ BURUK — MD5 atau SHA1 (mudah di-crack dengan rainbow table)
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()

# ✅ BENAR — Bcrypt dengan salt (lambat secara intentional)
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)  # Semakin tinggi = semakin lambat
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
\`\`\`

---

## 🔑 Secrets Management — Jangan Hardcode!

\`\`\`python
# ❌ SANGAT BURUK — Hardcode secrets di kode
API_KEY = "sk-1234abcd5678efgh"
DATABASE_URL = "postgresql://admin:P@ssw0rd@db.company.com/prod"

# ❌ BURUK — Commit ke Git (sekali ter-commit, tersimpan di history selamanya!)

# ✅ BENAR — Environment variables
import os
API_KEY = os.getenv("API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# .env file (JANGAN commit ke Git!)
# .gitignore harus berisi: .env
\`\`\`

\`\`\`bash
# .gitignore
.env
.env.local
.env.production
*.pem
*_rsa
credentials.json
\`\`\`

---

## 🛡️ Security Headers

\`\`\`javascript
// Express.js — Gunakan helmet
import helmet from 'helmet';
app.use(helmet());

// Headers yang ditambahkan helmet:
// X-Content-Type-Options: nosniff
// X-Frame-Options: SAMEORIGIN (cegah clickjacking)
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=31536000 (HTTPS always)
// Content-Security-Policy: ...

// Next.js — tambahkan di next.config.ts
async headers() {
    return [{
        source: '/:path*',
        headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
    }];
}
\`\`\`

---

## 🧹 Input Validation

\`\`\`python
# Selalu validasi dan sanitize input
from pydantic import BaseModel, EmailStr, validator

class UserInput(BaseModel):
    email: EmailStr                          # Auto validate email format
    password: str
    umur: int

    @validator('password')
    def password_kuat(cls, v):
        if len(v) < 8:
            raise ValueError('Password minimal 8 karakter')
        if not any(c.isupper() for c in v):
            raise ValueError('Harus ada huruf kapital')
        return v

    @validator('umur')
    def umur_valid(cls, v):
        if not 0 <= v <= 120:
            raise ValueError('Umur tidak valid')
        return v
\`\`\`

---

## 📝 Ringkasan

- SQL Injection: **selalu** gunakan parameterized query
- XSS: escape output, gunakan \`textContent\` bukan \`innerHTML\`
- IDOR: verifikasi kepemilikan resource sebelum return data
- Password: gunakan **bcrypt** dengan cost factor tinggi
- Secrets: **environment variables**, jangan hardcode, jangan commit
- Input: **validasi** di server, jangan hanya di client

> **Di pelajaran berikutnya, kita bahas keamanan perusahaan dan incident response!** 🏢
`;
