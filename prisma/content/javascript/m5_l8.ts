export const js_l8 = `
# ES6+ Modern — Fitur JavaScript yang Wajib Kamu Kuasai

JavaScript terus berkembang. ES6 (2015) dan versi-versi setelahnya membawa perubahan besar yang bikin kode lebih bersih, lebih pendek, dan lebih mudah dibaca. Kalau kamu lihat kode React atau Node.js modern, semua fitur ini ada di sana.

---

## 🤔 Kenapa Ini Penting?

Banyak tutorial JavaScript lawas masih pakai cara lama. Tapi di dunia kerja, **semua codebase production pakai ES6+**. Kalau kamu tidak kenal destructuring, spread operator, atau optional chaining — kamu akan kesulitan baca kode orang lain.

---

## 🔓 Destructuring — Ambil Nilai dengan Cara Elegan

\`\`\`javascript
// ─── Array destructuring ───
const koordinat = [10.5, 106.8, 50];

// Cara lama:
const lat = koordinat[0];
const lon = koordinat[1];

// Destructuring:
const [lat, lon, alt] = koordinat;
const [x, , z] = koordinat;  // Lewati index 1 pakai koma kosong

// Dengan default value
const [a = 0, b = 0, c = 0, d = 0] = [1, 2]; // d = 0 (pakai default)

// Swap nilai dua variabel — elegan!
let p = 5, q = 10;
[p, q] = [q, p];  // p = 10, q = 5

// ─── Object destructuring ───
const user = {
    nama: "Budi",
    umur: 25,
    email: "budi@email.com",
    alamat: {
        kota: "Jakarta",
        kodePos: "12345"
    }
};

// Dasar
const { nama, umur } = user;

// Rename saat destructure
const { nama: namaLengkap, umur: usia } = user;
console.log(namaLengkap);  // "Budi"

// Default value
const { nama: n, role = "user" } = user;  // role = "user" karena tidak ada di object

// Nested destructuring
const { alamat: { kota, kodePos } } = user;
console.log(kota);  // "Jakarta"

// Rest dalam destructuring
const { nama: nm, ...sisanya } = user;
console.log(sisanya);  // { umur, email, alamat }

// ─── Destructuring di parameter fungsi ───
function tampilkanUser({ nama, umur, role = "user" }) {
    console.log(\`\${nama} (\${umur} tahun) — \${role}\`);
}

tampilkanUser(user);  // "Budi (25 tahun) — user"

// ─── Destructuring array dari function return ───
function minMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}

const [minimum, maksimum] = minMax([3, 1, 8, 2, 9, 4]);
console.log(minimum, maksimum);  // 1 9
\`\`\`

---

## 🌊 Spread & Rest Operator

\`\`\`javascript
// ─── Spread (...) ─── Sebarkan elemen

// Spread array
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const gabungan = [...arr1, ...arr2];        // [1, 2, 3, 4, 5, 6]
const copy = [...arr1];                     // Copy array (bukan reference)
const denganTambahan = [...arr1, 99, 100];  // [1, 2, 3, 99, 100]

// Spread object
const baseConfig = { host: "localhost", port: 3000, debug: false };
const devConfig  = { ...baseConfig, debug: true, port: 3001 };
// { host: "localhost", port: 3001, debug: true }
// Properti yang sama di-override!

// Spread sebagai argumen fungsi
const angka = [5, 2, 8, 1, 9];
console.log(Math.max(...angka));   // 9 (sama dengan Math.max(5, 2, 8, 1, 9))

// ─── Rest (...) ─── Kumpulkan sisa argumen
function jumlahkan(pertama, kedua, ...lainnya) {
    console.log("Dua pertama:", pertama, kedua);
    console.log("Sisa:", lainnya);
    return pertama + kedua + lainnya.reduce((sum, n) => sum + n, 0);
}

jumlahkan(1, 2, 3, 4, 5);
// Dua pertama: 1 2
// Sisa: [3, 4, 5]
// Total: 15

// Praktik: merge objects
function buatKonfigurasi(options = {}) {
    const defaults = {
        tema: "terang",
        bahasa: "id",
        notifikasi: true,
        autoSave: true,
    };
    return { ...defaults, ...options };
}

const config = buatKonfigurasi({ tema: "gelap", bahasa: "en" });
// { tema: "gelap", bahasa: "en", notifikasi: true, autoSave: true }
\`\`\`

---

## 🔗 Optional Chaining & Nullish Coalescing

\`\`\`javascript
// ─── Optional Chaining (?.) ───
// Akses property yang mungkin null/undefined tanpa crash

const data = {
    user: {
        profil: {
            foto: "avatar.jpg"
        }
    }
};

// Cara lama — jelek dan panjang
const foto = data && data.user && data.user.profil && data.user.profil.foto;

// Optional chaining — elegan!
const foto2 = data?.user?.profil?.foto;    // "avatar.jpg"
const bio   = data?.user?.profil?.bio;     // undefined (tidak crash!)

// Optional chaining dengan method
const panjangNama = user?.nama?.toUpperCase()?.length;

// Optional chaining dengan array
const items = cart?.items?.[0]?.nama;

// Optional chaining dengan function call
const hasil = objek?.metodeTidakAda?.();   // undefined, tidak throw error

// ─── Nullish Coalescing (??) ───
// Return nilai kanan hanya kalau kiri null atau undefined
// (bukan 0, false, "", dsb!)

const nama     = null ?? "Tamu";          // "Tamu"
const username = undefined ?? "Guest";   // "Guest"
const skor     = 0 ?? 100;               // 0 (bukan 100! 0 bukan null/undefined)
const aktif    = false ?? true;          // false

// Bandingkan dengan || (OR):
const skor2 = 0 || 100;    // 100 (karena 0 dianggap falsy oleh ||)
const skor3 = 0 ?? 100;    // 0   (karena 0 bukan null/undefined)

// Kombinasi dengan optional chaining
const kota = user?.alamat?.kota ?? "Tidak diketahui";

// Nullish assignment (??=)
let config = {};
config.tema ??= "terang";    // Set hanya kalau null/undefined
config.tema ??= "gelap";     // Tidak diubah! Sudah ada nilainya

// Logical assignment operators
let a = null;
a ||= "default";    // a = "default" (set kalau falsy)
a &&= "ada";        // a = "ada" (set kalau truthy)
\`\`\`

---

## 🏷️ Tagged Template Literals

\`\`\`javascript
// Template literal biasa
const nama = "Budi";
const pesan = \`Halo, \${nama}!\`;

// Tagged template — fungsi yang "tag" template literal
function highlight(strings, ...values) {
    return strings.reduce((hasil, str, i) => {
        const val = values[i - 1];
        return hasil + \`<mark>\${val}</mark>\` + str;
    });
}

const harga = 150000;
const produk = "Laptop";
const html = highlight\`Beli \${produk} seharga Rp \${harga} sekarang!\`;
// Beli <mark>Laptop</mark> seharga Rp <mark>150000</mark> sekarang!

// Contoh nyata: SQL query yang aman dari injection
function sql(strings, ...values) {
    const query  = strings.join("?");
    const params = values;
    return { query, params };
}

const userId = 1;
const { query, params } = sql\`SELECT * FROM users WHERE id = \${userId}\`;
// query: "SELECT * FROM users WHERE id = ?"
// params: [1] → parameterized, aman dari SQL injection!
\`\`\`

---

## 🔄 Symbol, WeakMap & WeakSet

\`\`\`javascript
// Symbol — nilai unik yang tidak pernah sama
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);  // false! Selalu unik

// Berguna untuk property "private" di object
const _id = Symbol("_id");
const obj = {
    [_id]: 42,    // Property tersembunyi
    nama: "Budi"
};

console.log(obj[_id]);  // 42
console.log(Object.keys(obj));  // ["nama"] — _id tidak muncul!

// WeakMap — Map yang key-nya harus object, tidak cegah GC
const metadata = new WeakMap();

function proses(obj) {
    if (!metadata.has(obj)) {
        metadata.set(obj, { dibuat: Date.now(), hitungan: 0 });
    }
    const meta = metadata.get(obj);
    meta.hitungan++;
    return meta;
}

// WeakSet — Set yang elemen-nya harus object
const diproses = new WeakSet();

function prosesHanyaOnce(obj) {
    if (diproses.has(obj)) {
        console.log("Sudah diproses!");
        return;
    }
    // Lakukan sesuatu...
    diproses.add(obj);
}
\`\`\`

---

## 🎯 Praktik: Utilitas Helper Modern

\`\`\`javascript
// Kumpulan fungsi helper yang pakai semua fitur ES6+

// 1. Deep clone object
const deepClone = obj => JSON.parse(JSON.stringify(obj));

// 2. Merge objects
const merge = (...objects) => Object.assign({}, ...objects);

// 3. Pick properties dari object
const pick = (obj, keys) =>
    keys.reduce((result, key) => {
        if (key in obj) result[key] = obj[key];
        return result;
    }, {});

// 4. Omit properties dari object
const omit = (obj, keys) =>
    Object.fromEntries(
        Object.entries(obj).filter(([k]) => !keys.includes(k))
    );

// 5. Group array by property
const groupBy = (arr, key) =>
    arr.reduce((groups, item) => {
        const val = item[key];
        groups[val] = groups[val] ?? [];
        groups[val].push(item);
        return groups;
    }, {});

// Test
const produk = [
    { nama: "Laptop", kategori: "Elektronik", harga: 8000000 },
    { nama: "Mouse", kategori: "Elektronik", harga: 150000 },
    { nama: "Baju", kategori: "Fashion", harga: 200000 },
    { nama: "Celana", kategori: "Fashion", harga: 350000 },
];

const grouped = groupBy(produk, "kategori");
// { Elektronik: [...], Fashion: [...] }

const hanyaNama = pick(produk[0], ["nama", "harga"]);
// { nama: "Laptop", harga: 8000000 }

const tanpaHarga = omit(produk[0], ["harga"]);
// { nama: "Laptop", kategori: "Elektronik" }
\`\`\`

---

## 📝 Ringkasan

- **Destructuring**: ambil nilai dari array/object dengan sintaks ringkas
- **Spread** (\`...\`): sebarkan elemen — untuk clone, merge, dan argumen fungsi
- **Rest** (\`...rest\`): kumpulkan sisa parameter menjadi array
- **Optional chaining** (\`?.\`): akses aman untuk property yang mungkin null
- **Nullish coalescing** (\`??\`): nilai default hanya untuk null/undefined
- **Symbol**: nilai unik untuk property tersembunyi
- Template literal tagged: transformasi string custom

> **Selanjutnya: Async JavaScript yang Lebih Dalam — Promise chains, async/await patterns, dan error handling!** 🚀
`;
