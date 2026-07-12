export const ts_l8 = `
# Dekorator & Metadata — TypeScript di Level Enterprise

Dekorator adalah fitur yang dipakai di framework-framework besar seperti NestJS, Angular, dan TypeORM. Dengan dekorator, kamu bisa tambahkan perilaku ke class, method, atau property tanpa mengubah logika intinya.

---

## 🤔 Apa itu Dekorator?

Analogi: bayangkan kamu punya restoran. Kamu tidak perlu ubah resep masakan hanya karena mau tambah sistem reservasi, pencatatan waktu, atau diskon member. Kamu cukup "tempel" fitur-fitur itu dari luar.

Dekorator itu seperti "tempelan" yang bisa mengubah atau menambahkan perilaku ke kode tanpa menyentuh kode aslinya.

\`\`\`typescript
// tsconfig.json — aktifkan dulu
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
\`\`\`

---

## 📦 Class Decorator

\`\`\`typescript
// Dekorator class — menerima constructor sebagai argument

// Decorator: tambahkan timestamp ke class
function Timestamped<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        createdAt = new Date();
        updatedAt = new Date();

        touch() {
            this.updatedAt = new Date();
        }
    };
}

// Decorator: inject logger
function withLogger(namaClass: string) {
    return function <T extends { new(...args: any[]): {} }>(Base: T) {
        return class extends Base {
            log(pesan: string) {
                console.log(\`[\${namaClass}] \${pesan}\`);
            }
        };
    };
}

// Decorator: seal class (tidak bisa tambah property)
function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@Sealed
@Timestamped
@withLogger("Produk")
class Produk {
    constructor(
        public nama: string,
        public harga: number
    ) {}
}

const p = new Produk("Laptop", 8500000);
console.log(p.createdAt);   // Date saat dibuat
p.log("Produk baru dibuat"); // [Produk] Produk baru dibuat
\`\`\`

---

## 🔧 Method Decorator

\`\`\`typescript
// Method decorator — menerima (target, propertyKey, descriptor)

// Decorator: timing — ukur berapa lama method berjalan
function Timing(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function(...args: any[]) {
        const mulai = performance.now();
        const hasil = await original.apply(this, args);
        const akhir = performance.now();
        console.log(\`\${key} selesai dalam \${(akhir - mulai).toFixed(2)}ms\`);
        return hasil;
    };
    return descriptor;
}

// Decorator: memoize — cache hasil method
function Memoize(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const cache = new Map<string, any>();

    descriptor.value = function(...args: any[]) {
        const cacheKey = JSON.stringify(args);
        if (cache.has(cacheKey)) {
            console.log(\`Cache hit: \${key}(\${cacheKey})\`);
            return cache.get(cacheKey);
        }
        const hasil = original.apply(this, args);
        cache.set(cacheKey, hasil);
        return hasil;
    };
    return descriptor;
}

// Decorator: retry
function Retry(maxAttempt = 3) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            for (let i = 1; i <= maxAttempt; i++) {
                try {
                    return await original.apply(this, args);
                } catch (err) {
                    if (i === maxAttempt) throw err;
                    console.log(\`\${key}: gagal, retry \${i}/\${maxAttempt}...\`);
                    await new Promise(r => setTimeout(r, i * 1000));
                }
            }
        };
        return descriptor;
    };
}

class ApiService {
    @Timing
    @Memoize
    async hitungFibonacci(n: number): Promise<number> {
        if (n <= 1) return n;
        // Simulasi komputasi berat
        await new Promise(r => setTimeout(r, 100));
        return n; // Simplified
    }

    @Retry(3)
    async fetchData(url: string): Promise<any> {
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
    }
}
\`\`\`

---

## 🏷️ Property Decorator

\`\`\`typescript
// Property decorator untuk validasi
function MinLength(min: number) {
    return function(target: any, key: string) {
        let value: string;

        Object.defineProperty(target, key, {
            get() { return value; },
            set(newValue: string) {
                if (newValue.length < min) {
                    throw new Error(\`\${key} harus minimal \${min} karakter\`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true,
        });
    };
}

function IsEmail(target: any, key: string) {
    let value: string;
    Object.defineProperty(target, key, {
        get() { return value; },
        set(newValue: string) {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(newValue)) {
                throw new Error(\`\${key} harus format email yang valid\`);
            }
            value = newValue;
        },
        enumerable: true,
        configurable: true,
    });
}

class Pengguna {
    @MinLength(3)
    nama: string = "";

    @IsEmail
    email: string = "";

    constructor(nama: string, email: string) {
        this.nama  = nama;   // Trigger setter
        this.email = email;
    }
}

try {
    new Pengguna("A", "budi@email.com");   // Error! nama terlalu pendek
} catch (e) {
    console.error(e.message);  // "nama harus minimal 3 karakter"
}

try {
    new Pengguna("Budi", "bukan-email");   // Error! format email salah
} catch (e) {
    console.error(e.message);  // "email harus format email yang valid"
}
\`\`\`

---

## 🏗️ Dependency Injection Pattern

\`\`\`typescript
// DI Container sederhana menggunakan decorator

// Metadata registry
const registry = new Map<string, any>();

function Injectable(identifier: string) {
    return function(constructor: Function) {
        registry.set(identifier, constructor);
    };
}

function Inject(identifier: string) {
    return function(target: any, _key: string, paramIndex: number) {
        const existing = Reflect.getMetadata("inject", target) ?? {};
        existing[paramIndex] = identifier;
        Reflect.defineMetadata("inject", existing, target);
    };
}

function resolve<T>(identifier: string): T {
    const Constructor = registry.get(identifier);
    if (!Constructor) throw new Error(\`Tidak ada \${identifier} di registry\`);

    const injectMap = Reflect.getMetadata("inject", Constructor) ?? {};
    const deps = Object.entries(injectMap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([_, id]) => resolve(id as string));

    return new Constructor(...deps);
}

// Penggunaan
@Injectable("UserRepository")
class UserRepository {
    findById(id: number) {
        return { id, nama: "Budi", email: "budi@email.com" };
    }
}

@Injectable("EmailService")
class EmailService {
    send(to: string, pesan: string) {
        console.log(\`Email ke \${to}: \${pesan}\`);
    }
}

@Injectable("UserService")
class UserService {
    constructor(
        @Inject("UserRepository") private repo: UserRepository,
        @Inject("EmailService")  private email: EmailService
    ) {}

    async prosesUser(id: number) {
        const user = this.repo.findById(id);
        this.email.send(user.email, \`Halo \${user.nama}!\`);
        return user;
    }
}

const service = resolve<UserService>("UserService");
service.prosesUser(1);
\`\`\`

---

## 📝 Ringkasan

- **Class decorator**: transformasi atau extend class
- **Method decorator**: wrap method dengan logika tambahan (timing, memoize, retry)
- **Property decorator**: validasi atau transform nilai property
- **Dekorator dengan argumen**: factory function yang return decorator
- **Dependency Injection**: pattern DI menggunakan dekorator dan metadata

Dekorator dipakai luas di: NestJS (server), Angular (frontend), TypeORM (database), class-validator.

> **Kursus TypeScript selesai! Kamu sudah punya pemahaman mendalam tentang tipe system JavaScript yang paling kuat.** 🎉
`;
