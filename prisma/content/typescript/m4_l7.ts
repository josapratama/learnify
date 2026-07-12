export const ts_l7 = `
# Conditional Types & Mapped Types Lanjutan — TypeScript yang Sesungguhnya

Kita sudah belajar TypeScript dasar sampai patterns. Sekarang masuk ke fitur-fitur yang bikin TypeScript benar-benar powerful — **conditional types** dan **mapped types lanjutan**. Ini yang dipakai di library besar seperti React, Zod, dan Prisma.

---

## 🔀 Conditional Types — Tipe yang "Berpikir"

\`\`\`typescript
// T extends U ? X : Y
// "Kalau T bisa di-assign ke U, pakai tipe X, kalau tidak pakai Y"

// Contoh dasar
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;   // true
type B = IsString<number>;   // false

// Lebih berguna: ekstrak tipe tertentu
type Unwrap<T> = T extends Promise<infer U> ? U : T;
// infer U = "simpan tipe ini untuk dipakai"

type HasilFetch = Unwrap<Promise<{ nama: string }>>;   // { nama: string }
type BiasaAja   = Unwrap<string>;                       // string

// Unwrap array
type ElementType<T> = T extends (infer U)[] ? U : never;
type ElemString = ElementType<string[]>;   // string
type ElemNumber = ElementType<number[]>;   // number

// Conditional yang lebih complex
type NonNullable<T> = T extends null | undefined ? never : T;
// Sama persis dengan built-in NonNullable!

// Flatten nested array
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;
type NestedArr = Flatten<number[][][]>;  // number

// Extract return type dari async function
type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
    T extends (...args: any[]) => Promise<infer R> ? R : never;

async function ambilUser() {
    return { id: 1, nama: "Budi", email: "budi@email.com" };
}

type UserType = AsyncReturnType<typeof ambilUser>;
// { id: number; nama: string; email: string }
\`\`\`

---

## 🗺️ Mapped Types Lanjutan

\`\`\`typescript
// Mapped types: transformasi setiap key/value dari type yang ada

interface Produk {
    id: number;
    nama: string;
    harga: number;
    stok: number;
    aktif: boolean;
}

// Buat semua property menjadi nullable
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

type ProdukNullable = Nullable<Produk>;
// id: number | null; nama: string | null; ...

// Buat versi "deep readonly"
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Mapping dengan kondisi — filter hanya property tertentu
type OnlyNumbers<T> = {
    [K in keyof T as T[K] extends number ? K : never]: T[K];
};

type HanyaAngka = OnlyNumbers<Produk>;
// { id: number; harga: number; stok: number }

// Rename key saat mapping
type PrefixedKeys<T, Prefix extends string> = {
    [K in keyof T as \`\${Prefix}\${Capitalize<string & K>}\`]: T[K];
};

type PrefixedProduk = PrefixedKeys<{ nama: string; harga: number }, "produk">;
// { produkNama: string; produkHarga: number }

// Membuat getter type
type Getters<T> = {
    [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type ProdukGetters = Getters<Pick<Produk, "nama" | "harga">>;
// { getNama: () => string; getHarga: () => number }
\`\`\`

---

## 🏷️ Template Literal Types Lanjutan

\`\`\`typescript
// Kombinasi dengan union types untuk generate semua kemungkinan
type EventName = "click" | "focus" | "blur" | "change";
type HandlerName = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onFocus" | "onBlur" | "onChange"

// Tipe path yang aman
type Join<T extends string[], D extends string> =
    T extends [] ? never :
    T extends [infer F extends string] ? F :
    T extends [infer F extends string, ...infer R extends string[]] ?
        \`\${F}\${D}\${Join<R, D>}\` : string;

type Path = Join<["user", "profile", "email"], ".">;
// "user.profile.email"

// CSS-like color system
type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ColorName = "slate" | "blue" | "green" | "red" | "yellow";
type TailwindColor = \`\${ColorName}-\${Shade}\`;
// "slate-50" | "slate-100" | ... | "yellow-900"

// HTTP status type
type SuccessStatus = 200 | 201 | 202 | 204;
type ErrorStatus   = 400 | 401 | 403 | 404 | 422 | 500;
type ApiStatus     = SuccessStatus | ErrorStatus;

type ApiResponse<T, S extends ApiStatus = 200> =
    S extends SuccessStatus
        ? { status: S; data: T; message: string }
        : { status: S; error: string; details?: unknown };

const ok:  ApiResponse<{ id: number }, 200> = { status: 200, data: { id: 1 }, message: "OK" };
const err: ApiResponse<never, 404>          = { status: 404, error: "Not found" };
\`\`\`

---

## 🔄 Recursive Types

\`\`\`typescript
// Tipe untuk JSON value
type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

const valid: JsonValue = {
    nama: "Budi",
    umur: 25,
    alamat: {
        kota: "Jakarta",
        kodePos: "12345",
    },
    hobi: ["coding", "hiking"],
    aktif: true,
    deleted: null,
};

// Tipe untuk path nested object
type NestedPath<T extends object, Prefix extends string = ""> = {
    [K in keyof T & string]:
        T[K] extends object
            ? NestedPath<T[K], \`\${Prefix}\${Prefix extends "" ? "" : "."}\${K}\`>
            : \`\${Prefix}\${Prefix extends "" ? "" : "."}\${K}\`;
}[keyof T & string];

type UserPaths = NestedPath<{
    id: number;
    profil: {
        nama: string;
        alamat: { kota: string; provinsi: string };
    };
}>;
// "id" | "profil.nama" | "profil.alamat.kota" | "profil.alamat.provinsi"
\`\`\`

---

## 🎭 Variadic Tuple Types

\`\`\`typescript
// Tuple yang bisa "menyebar"
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type AB = Concat<[1, 2], [3, 4]>;   // [1, 2, 3, 4]

// Fungsi dengan typed parameter tergantung input
function zip<T extends unknown[], U extends unknown[]>(
    arr1: T,
    arr2: U
): { [K in keyof T]: [T[K], K extends keyof U ? U[K] : never] } {
    return arr1.map((item, i) => [item, arr2[i]]) as any;
}

// Prepend ke tuple
type Prepend<T, Tuple extends unknown[]> = [T, ...Tuple];
type PrependString = Prepend<string, [number, boolean]>;  // [string, number, boolean]

// Function yang terima callback dengan typed parameters
function pipe<T>(value: T): {
    then<U>(fn: (val: T) => U): ReturnType<typeof pipe<U>>;
    value(): T;
} {
    return {
        then: <U>(fn: (val: T) => U) => pipe(fn(value)),
        value: () => value,
    };
}

const hasil = pipe(5)
    .then(n => n * 2)       // 10
    .then(n => \`\${n}\`)      // "10"
    .then(s => s + "!")     // "10!"
    .value();               // TypeScript tahu ini string!
\`\`\`

---

## 🎯 Praktik: Type-Safe Event Emitter yang Canggih

\`\`\`typescript
// Event emitter yang sepenuhnya type-safe dengan semua pattern yang kita pelajari

type EventMap = Record<string, unknown>;

class TypedEmitter<Events extends EventMap> {
    #listeners = new Map<keyof Events, Set<Function>>();

    on<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ): () => void {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, new Set());
        }
        this.#listeners.get(event)!.add(listener);
        return () => this.off(event, listener);
    }

    once<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ): void {
        const wrapper = (data: Events[K]) => {
            listener(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    off<K extends keyof Events>(event: K, listener: Function): void {
        this.#listeners.get(event)?.delete(listener);
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K] extends void ? [] : [Events[K]]
    ): void {
        this.#listeners.get(event)?.forEach(fn => fn(...args));
    }
}

// Penggunaan
type AppEvents = {
    "user:login":    { userId: string; timestamp: Date };
    "user:logout":   { userId: string };
    "item:purchased": { itemId: string; price: number; userId: string };
    "error":         { message: string; code: number };
};

const emitter = new TypedEmitter<AppEvents>();

const cleanup = emitter.on("user:login", ({ userId, timestamp }) => {
    // TypeScript tahu persis tipe data-nya!
    console.log(\`User \${userId} login pada \${timestamp.toISOString()}\`);
});

emitter.emit("user:login", { userId: "u123", timestamp: new Date() });
// emitter.emit("user:login", { userId: 123 });  // ❌ Error! userId harus string

cleanup();  // Unsubscribe
\`\`\`

---

## 📝 Ringkasan

- **Conditional types**: \`T extends U ? X : Y\` — tipe yang bercabang
- **infer**: ekstrak tipe dari dalam tipe yang lebih kompleks
- **Mapped types + \`as\`**: filter, rename, atau transform key saat mapping
- **Template literal types**: buat string tipe dari kombinasi union
- **Recursive types**: tipe yang mereferensi dirinya sendiri (JSON, paths)
- **Variadic tuples**: manipulasi tuple dengan spread

> **Selanjutnya: TypeScript di proyek nyata — design patterns, best practices, dan tips performance!** 🚀
`;
