export const ts_l4 = `
# Class dan OOP di TypeScript — Buat Kode yang Bisa "Tumbuh"

Object-Oriented Programming (OOP) itu cara mikir tentang kode yang berbeda — bukannya urutan instruksi, kamu pikirin kode sebagai kumpulan "objek" yang punya data dan perilaku sendiri.

Analogi paling mudah: bayangkan kamu bikin game. Kamu punya "Karakter". Setiap karakter punya nama, HP, level. Setiap karakter bisa bergerak, menyerang, bertahan. Daripada nulis fungsi terpisah untuk setiap aksi, kamu definisikan satu "blueprint" Karakter — dan semua karakter mengikuti blueprint itu.

Blueprint itu namanya **Class**.

---

## 🏗️ Dasar Class di TypeScript

\`\`\`typescript
class Produk {
    // Properties — data yang dimiliki setiap produk
    id: number;
    nama: string;
    harga: number;
    stok: number;

    // Constructor — dijalankan saat 'new Produk(...)' dipanggil
    constructor(id: number, nama: string, harga: number, stok: number) {
        this.id    = id;
        this.nama  = nama;
        this.harga = harga;
        this.stok  = stok;
    }

    // Method — aksi yang bisa dilakukan produk
    tampilkanInfo(): string {
        return \`[\${this.id}] \${this.nama} — Rp \${this.harga.toLocaleString("id-ID")} (stok: \${this.stok})\`;
    }

    jual(qty: number): boolean {
        if (qty > this.stok) {
            console.log("Stok tidak mencukupi!");
            return false;
        }
        this.stok -= qty;
        return true;
    }
}

// Buat instance dari class
const laptop = new Produk(1, "Laptop ASUS", 8500000, 10);
const mouse  = new Produk(2, "Mouse Logitech", 150000, 50);

console.log(laptop.tampilkanInfo()); // [1] Laptop ASUS — Rp 8.500.000 (stok: 10)
laptop.jual(3);
console.log(laptop.stok); // 7
\`\`\`

---

## 🔒 Access Modifiers — Siapa yang Boleh Akses Apa

\`\`\`typescript
class RekeningBank {
    readonly noRekening: string;   // Bisa dibaca, tidak bisa diubah dari luar
    private saldo: number;         // Hanya bisa diakses dari dalam class ini
    protected namaPemilik: string; // Bisa diakses di class ini dan class turunannya
    public bank: string;           // Default, bisa diakses dari mana saja

    constructor(noRek: string, pemilik: string, saldoAwal: number, bank: string) {
        this.noRekening  = noRek;
        this.namaPemilik = pemilik;
        this.saldo       = saldoAwal;
        this.bank        = bank;
    }

    // Getter — cara "baca" property private dengan aman
    get infaSaldo(): string {
        // Tampilkan sebagian saldo saja (privacy)
        const masking = "*".repeat(String(this.saldo).length - 3);
        return \`Rp \${masking}xxx\`;
    }

    // Method public untuk manipulasi saldo
    setor(jumlah: number): void {
        if (jumlah <= 0) throw new Error("Jumlah setor harus positif");
        this.saldo += jumlah;
        console.log(\`Berhasil setor Rp \${jumlah.toLocaleString("id-ID")}\`);
    }

    tarik(jumlah: number): void {
        if (jumlah > this.saldo) throw new Error("Saldo tidak mencukupi");
        this.saldo -= jumlah;
        console.log(\`Berhasil tarik Rp \${jumlah.toLocaleString("id-ID")}\`);
    }
}

const rekening = new RekeningBank("1234567890", "Budi", 5000000, "BCA");
rekening.setor(500000);   // OK
rekening.tarik(200000);   // OK
// rekening.saldo = 999999;  // ❌ Error! saldo adalah private
console.log(rekening.infaSaldo);  // Rp ****xxx

// Shorthand constructor — properti langsung dari parameter!
class Pengguna {
    constructor(
        public readonly id: number,    // otomatis jadi property
        public nama: string,
        private email: string,
        protected role: string = "user"
    ) {}  // Body kosong — TypeScript urus semuanya

    tampilkanEmail(): string {
        return this.email; // Bisa akses dari dalam
    }
}

const user = new Pengguna(1, "Siti", "siti@email.com");
console.log(user.nama);  // "Siti" ✅
// console.log(user.email); // ❌ Error! private
\`\`\`

---

## 🧬 Inheritance — Turunkan Sifat dari Class Lain

\`\`\`typescript
// Class "induk" — berisi yang umum untuk semua karyawan
class Karyawan {
    constructor(
        public id: number,
        public nama: string,
        protected gajiBulanan: number
    ) {}

    tampilkanInfo(): string {
        return \`ID: \${this.id} | \${this.nama}\`;
    }

    hitungGajiTahunan(): number {
        return this.gajiBulanan * 12;
    }
}

// Class "anak" — warisi semua dari Karyawan, tambah yang spesifik
class Manager extends Karyawan {
    private timnya: Karyawan[] = [];

    constructor(id: number, nama: string, gaji: number, public departemen: string) {
        super(id, nama, gaji);  // Panggil constructor parent DULU
    }

    tambahAnggotaTim(karyawan: Karyawan): void {
        this.timnya.push(karyawan);
    }

    // Override method parent
    tampilkanInfo(): string {
        return \`\${super.tampilkanInfo()} | Manager \${this.departemen} (\${this.timnya.length} anggota)\`;
    }

    // Method tambahan khusus Manager
    hitungGajiTahunan(): number {
        return super.hitungGajiTahunan() + 12_000_000; // Bonus tahunan manager
    }
}

class Developer extends Karyawan {
    constructor(id: number, nama: string, gaji: number, public bahasa: string[]) {
        super(id, nama, gaji);
    }

    tampilkanInfo(): string {
        return \`\${super.tampilkanInfo()} | Dev [\${this.bahasa.join(", ")}]\`;
    }
}

const mgr = new Manager(1, "Rina", 15000000, "Engineering");
const dev = new Developer(2, "Doni", 12000000, ["TypeScript", "React", "Node"]);

mgr.tambahAnggotaTim(dev);
console.log(mgr.tampilkanInfo());   // ID: 1 | Rina | Manager Engineering (1 anggota)
console.log(dev.tampilkanInfo());   // ID: 2 | Doni | Dev [TypeScript, React, Node]
console.log(mgr.hitungGajiTahunan()); // 192.000.000 (180jt + 12jt bonus)
\`\`\`

---

## 🎭 Abstract Class dan Interface

\`\`\`typescript
// Abstract class — template yang tidak bisa diinstansiasi langsung
// Tapi bisa punya method yang sudah diimplementasikan
abstract class HewanPeliharaan {
    constructor(public nama: string, public umur: number) {}

    abstract suara(): string;     // Harus diimplementasikan di class anak
    abstract gerak(): string;     // Harus diimplementasikan di class anak

    // Method konkret — tersedia untuk semua class anak
    perkenalan(): string {
        return \`Namaku \${this.nama}, umurku \${this.umur} tahun. \${this.suara()}\`;
    }
}

class Kucing extends HewanPeliharaan {
    suara(): string { return "Meong! 🐱"; }
    gerak(): string { return "Melompat elegan"; }
}

class Anjing extends HewanPeliharaan {
    suara(): string { return "Woof! 🐶"; }
    gerak(): string { return "Berlari kencang"; }
}

// const h = new HewanPeliharaan("?", 0); // ❌ Error! Abstract tidak bisa di-new
const kucing = new Kucing("Mimi", 3);
const anjing = new Anjing("Rex", 5);

console.log(kucing.perkenalan());  // Namaku Mimi, umurku 3 tahun. Meong! 🐱
console.log(anjing.gerak());       // Berlari kencang

// Interface vs Abstract:
// Interface = kontrak murni (tidak ada implementasi)
// Abstract  = sebagian diimplementasikan, sebagian harus di-override
interface BisaTerbang {
    terbang(): void;
    ketinggianMaksimal: number;
}

class Burung extends HewanPeliharaan implements BisaTerbang {
    ketinggianMaksimal = 100; // Wajib karena interface
    suara()  { return "Cuit!"; }
    gerak()  { return "Terbang"; }
    terbang() { console.log("Mengepakkan sayap dan terbang!"); }
}
\`\`\`

---

## 🔄 Static Member — Milik Class, Bukan Instance

\`\`\`typescript
class KonversiSuhu {
    // Static property — satu nilai, milik class (bukan tiap objek)
    static readonly FAHRENHEIT_OFFSET = 32;
    static readonly FAHRENHEIT_SCALE  = 9/5;
    static hitungTotal = 0; // Hitung berapa kali konversi dilakukan

    // Static method — dipanggil dari class langsung, bukan dari instance
    static celsiusKeFahrenheit(c: number): number {
        this.hitungTotal++;
        return (c * this.FAHRENHEIT_SCALE) + this.FAHRENHEIT_OFFSET;
    }

    static fahrenheitKeCelsius(f: number): number {
        this.hitungTotal++;
        return (f - this.FAHRENHEIT_OFFSET) / this.FAHRENHEIT_SCALE;
    }
}

// Panggil langsung dari nama class — tidak perlu new!
console.log(KonversiSuhu.celsiusKeFahrenheit(100));  // 212°F
console.log(KonversiSuhu.fahrenheitKeCelsius(98.6)); // 37°C (suhu tubuh normal)
console.log(KonversiSuhu.hitungTotal);               // 2
\`\`\`

---

## 📝 Ringkasan

OOP di TypeScript membuat kode lebih terorganisir dan mudah di-maintain, terutama untuk proyek yang makin besar:

- **Class** = blueprint/template objek, punya properties dan methods
- **Access modifiers**: \`public\` (default), \`private\` (dalam class), \`protected\` (class + turunannya), \`readonly\`
- **Inheritance** (\`extends\`) = turunkan sifat dari class lain, \`super\` untuk akses parent
- **Abstract class** = template yang belum lengkap, perlu diselesaikan di class anak
- **Interface** = kontrak murni tanpa implementasi
- **Static** = milik class itu sendiri, bukan tiap instance

> **Selanjutnya: Modul, Namespace, dan cara TypeScript dipakai di project React/Next.js skala besar!** 🚀
`;
