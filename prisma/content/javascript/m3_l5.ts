export const js_l5 = `
# DOM Manipulation — Cara JavaScript Mengubah Halaman Web

Selama ini kamu sudah bisa menulis JavaScript yang output-nya ke console. Tapi yang lebih menarik adalah: bagaimana JavaScript mengubah halaman web yang sudah tampil di browser?

Jawabannya adalah DOM — **Document Object Model**. Ketika browser membaca HTML, dia tidak simpan sebagai teks biasa. Dia membangun sebuah "pohon objek" yang merepresentasikan setiap elemen. Dan JavaScript bisa membaca, mengubah, menambah, atau menghapus elemen dari pohon ini kapan saja.

Ini yang membuat web "hidup":
- Tombol yang berubah warna saat diklik
- Form yang kasih notifikasi "Email tidak valid" tanpa perlu reload
- Konten yang muncul saat scroll ke bawah
- Semua yang "dinamis" di website modern

---

## Temukan Elemennya Dulu

Sebelum mengubah sesuatu, kamu harus tahu dulu elemen mana yang mau diubah:

\`\`\`html
<!-- HTML -->
<h1 id="judul-utama">Halo Dunia!</h1>
<p class="teks-biasa">Ini paragraf pertama.</p>
<button id="tombol-klik">Klik Saya!</button>
\`\`\`

\`\`\`javascript
// querySelector — yang paling sering dipakai, sintaksis mirip CSS
const judul = document.querySelector("#judul-utama");      // # untuk ID
const paragraf = document.querySelector(".teks-biasa");    // . untuk class
const tombol = document.querySelector("button");           // nama tag

// querySelectorAll — ambil SEMUA yang cocok
const semuaParagraf = document.querySelectorAll("p");
// Mengembalikan NodeList, bisa di-forEach

console.log(judul);     // Elemen h1
console.log(paragraf);  // Elemen p
\`\`\`

---

## Langkah 2: Ubah Isinya

Setelah dapat elemennya, sekarang kita bisa ubah apa saja!

\`\`\`javascript
const judul = document.querySelector("h1");

// Ubah teksnya
judul.textContent = "JavaScript itu seru!";
// ✅ Aman — tidak bisa disisipi HTML berbahaya

// Atau kalau mau sisipkan HTML
judul.innerHTML = "<em>JavaScript</em> itu <strong>seru!</strong>";
// ⚠️ Hati-hati dengan ini kalau isinya dari input pengguna

// Ubah atribut
const gambar = document.querySelector("img");
gambar.src = "foto-baru.jpg";
gambar.alt = "Foto pemandangan";

// Ubah style langsung
judul.style.color = "blue";
judul.style.fontSize = "32px";
judul.style.fontWeight = "bold";
\`\`\`

**Tapi tunggu...** Ada cara yang lebih baik daripada ubah style satu-satu. Pakai CSS class!

\`\`\`css
/* Tulis di CSS dulu */
.judul-aktif {
    color: blue;
    font-size: 32px;
    font-weight: bold;
    text-decoration: underline;
}
\`\`\`

\`\`\`javascript
// Lalu di JavaScript, tinggal tambah/hapus classnya
const judul = document.querySelector("h1");

judul.classList.add("judul-aktif");     // Tambah class
judul.classList.remove("judul-aktif"); // Hapus class
judul.classList.toggle("judul-aktif"); // Kalau ada = hapus, kalau tidak ada = tambah

// Ini jauh lebih bersih dan bisa dikelola!
\`\`\`

---

## Langkah 3: Dengerin Event (Reaksi terhadap Aksi Pengguna)

Inilah bagian paling seru! Kita bisa buat halaman "bereaksi" terhadap apa yang dilakukan pengguna.

\`\`\`html
<button id="tombol-sapa">Sapa Saya!</button>
<p id="pesan-output"></p>
\`\`\`

\`\`\`javascript
const tombol = document.querySelector("#tombol-sapa");
const output = document.querySelector("#pesan-output");

// "addEventListener" = "dengarkan kalau ada yang..."
tombol.addEventListener("click", function() {
    // Ini dijalankan setiap kali tombol diklik!
    output.textContent = "Hei! Kamu baru aja klik tombolnya 😊";
    tombol.textContent = "Diklik!";
    tombol.style.backgroundColor = "green";
});

// Bisa juga pakai arrow function — lebih ringkas
tombol.addEventListener("click", () => {
    output.textContent = "Hei! Kamu baru aja klik tombolnya 😊";
});
\`\`\`

### Event yang Sering Dipakai

\`\`\`javascript
const input = document.querySelector("input");
const form = document.querySelector("form");

// Saat pengguna mengetik
input.addEventListener("input", (e) => {
    console.log("Isi sekarang:", e.target.value);
    // e.target adalah elemen yang memicu event
});

// Saat pengguna klik di luar input (selesai mengisi)
input.addEventListener("blur", () => {
    console.log("Pengguna selesai mengisi");
});

// Saat form disubmit
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Ini PENTING! Cegah reload halaman
    console.log("Form disubmit, data diproses...");
});

// Saat mouse masuk ke elemen
const kotak = document.querySelector(".kotak");
kotak.addEventListener("mouseenter", () => {
    kotak.style.backgroundColor = "lightblue";
});
kotak.addEventListener("mouseleave", () => {
    kotak.style.backgroundColor = "";
});
\`\`\`

---

## Contoh Nyata: Form Validasi Langsung

Ini contoh yang sering kamu lihat di website — validasi email sebelum form disubmit:

\`\`\`html
<form id="form-login">
    <input type="email" id="email" placeholder="Email kamu">
    <span id="pesan-error" style="color:red; display:none">Email tidak valid!</span>
    <button type="submit">Masuk</button>
</form>
\`\`\`

\`\`\`javascript
const emailInput = document.querySelector("#email");
const pesanError = document.querySelector("#pesan-error");
const form = document.querySelector("#form-login");

// Cek saat pengguna mengetik
emailInput.addEventListener("input", () => {
    const email = emailInput.value;
    const emailValid = email.includes("@") && email.includes(".");
    
    if (!emailValid && email.length > 0) {
        // Tampilkan pesan error
        pesanError.style.display = "block";
        emailInput.style.borderColor = "red";
    } else {
        // Sembunyikan pesan error
        pesanError.style.display = "none";
        emailInput.style.borderColor = "green";
    }
});

// Validasi saat submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    if (!email.includes("@")) {
        alert("Tolong isi email yang valid dulu!");
        return;
    }
    
    console.log("Login dengan email:", email);
    // Di sini biasanya kita kirim data ke server
});
\`\`\`

Coba bayangkan: tanpa JavaScript, pengguna harus klik submit dulu baru tahu emailnya salah. Dengan JavaScript, kita bisa kasih tahu langsung saat mereka mengetik. Jauh lebih nyaman!

---

## Buat dan Hapus Elemen Secara Dinamis

Ini yang bikin aplikasi terasa "hidup" — konten yang muncul dan hilang tanpa reload!

\`\`\`javascript
// Buat elemen baru
const elemenBaru = document.createElement("p");
elemenBaru.textContent = "Saya baru muncul!";
elemenBaru.classList.add("pesan-baru");

// Tambahkan ke halaman
const container = document.querySelector("#container");
container.appendChild(elemenBaru);  // Tambah di akhir
// atau
container.prepend(elemenBaru);      // Tambah di awal

// Hapus elemen
elemenBaru.remove(); // Langsung hapus diri sendiri

// Contoh nyata: Todo list sederhana
function tambahTugas(isiTugas) {
    const item = document.createElement("li");
    item.textContent = isiTugas;
    
    // Tombol hapus di setiap item
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "✕";
    tombolHapus.addEventListener("click", () => {
        item.remove(); // Hapus item ini saat tombolnya diklik
    });
    
    item.appendChild(tombolHapus);
    document.querySelector("#daftar-tugas").appendChild(item);
}

tambahTugas("Belajar JavaScript");
tambahTugas("Buat project pertama");
tambahTugas("Upload ke GitHub");
\`\`\`

---

## 📝 Yang Perlu Diingat

1. **Temukan dulu** pakai \`document.querySelector()\` atau \`querySelectorAll()\`
2. **Ubah konten** pakai \`.textContent\` (aman) atau \`.innerHTML\` (perlu hati-hati)
3. **Ubah tampilan** pakai \`.classList.add/remove/toggle()\` — lebih bersih dari ubah style langsung
4. **Reaksi ke aksi** pakai \`.addEventListener("click", fungsi)\`
5. **Cegah default** pakai \`e.preventDefault()\` — wajib di form!

> **Praktik terbaik:** Coba buat sebuah halaman HTML sederhana, lalu mainkan DOM-nya dari browser console. Satu jam eksplorasi lebih berharga dari membaca sepuluh jam! 🎯
`;
