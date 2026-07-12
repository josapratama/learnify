export const js_l9 = `
# Promise & Async JavaScript Lanjutan — Kuasai Asynchronous

Di pelajaran sebelumnya kita sudah kenalan sama fetch dan async/await dasar. Sekarang kita bahas lebih dalam — karena di dunia nyata, kamu sering butuh jalankan banyak request sekaligus, handle error yang kompleks, dan bikin kode async yang bersih.

---

## 🔄 Promise Chaining yang Bersih

\`\`\`javascript
// Masalah "callback hell" — nested yang bikin pusing
fetch("/api/user/1")
    .then(res => res.json())
    .then(user => {
        return fetch(\`/api/orders?userId=\${user.id}\`);
    })
    .then(res => res.json())
    .then(orders => {
        return fetch(\`/api/products?ids=\${orders.map(o => o.productId).join(",")}\`);
    })
    .then(res => res.json())
    .then(products => console.log(products))
    .catch(err => console.error(err));

// Dengan async/await — jauh lebih bersih!
async function getUserOrders(userId) {
    try {
        const userRes  = await fetch(\`/api/user/\${userId}\`);
        const user     = await userRes.json();

        const orderRes = await fetch(\`/api/orders?userId=\${user.id}\`);
        const orders   = await orderRes.json();

        const ids      = orders.map(o => o.productId).join(",");
        const prodRes  = await fetch(\`/api/products?ids=\${ids}\`);
        const products = await prodRes.json();

        return { user, orders, products };
    } catch (error) {
        console.error("Gagal ambil data:", error.message);
        throw error;
    }
}
\`\`\`

---

## ⚡ Promise.all, Promise.allSettled, Promise.race, Promise.any

\`\`\`javascript
// ─── Promise.all — jalankan paralel, tunggu semua selesai ───
// Gagal semua kalau SATU saja gagal
async function ambilDashboard(userId) {
    // Ini SEQUENTIAL — lambat! Setiap await nunggu yang sebelumnya
    // const user  = await fetchUser(userId);
    // const posts = await fetchPosts(userId);
    // const stats = await fetchStats(userId);

    // Ini PARALEL — jauh lebih cepat!
    const [user, posts, stats] = await Promise.all([
        fetch(\`/api/users/\${userId}\`).then(r => r.json()),
        fetch(\`/api/posts?userId=\${userId}\`).then(r => r.json()),
        fetch(\`/api/stats/\${userId}\`).then(r => r.json()),
    ]);
    // Semua 3 request jalan bersamaan!

    return { user, posts, stats };
}

// ─── Promise.allSettled — tunggu semua, tidak peduli gagal ───
// Berguna kalau mau ambil data dari banyak sumber
const hasil = await Promise.allSettled([
    fetch("/api/service-a").then(r => r.json()),
    fetch("/api/service-b").then(r => r.json()),
    fetch("/api/service-c-yang-mati").then(r => r.json()),  // Gagal!
]);

hasil.forEach((result, i) => {
    if (result.status === "fulfilled") {
        console.log(\`Service \${i}: OK\`, result.value);
    } else {
        console.log(\`Service \${i}: Gagal\`, result.reason.message);
    }
});
// Service 0: OK {...}
// Service 1: OK {...}
// Service 2: Gagal  Network error

// ─── Promise.race — ambil yang paling cepat ───
// Berguna untuk timeout!
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(\`Timeout setelah \${ms}ms\`)), ms)
    );
    return Promise.race([promise, timeout]);
}

try {
    const data = await withTimeout(fetch("/api/lambat"), 5000);
    // Kalau fetch lebih dari 5 detik, lempar error
} catch (err) {
    console.error(err.message);  // "Timeout setelah 5000ms"
}

// ─── Promise.any — ambil yang pertama SUKSES ───
// Berbeda dari race: abaikan yang gagal, ambil yang pertama berhasil
const data = await Promise.any([
    fetch("https://server1.api.com/data").then(r => r.json()),
    fetch("https://server2.api.com/data").then(r => r.json()),  // Fallback
    fetch("https://server3.api.com/data").then(r => r.json()),  // Fallback
]);
// Ambil dari server mana yang paling cepat respond!
\`\`\`

---

## 🔁 Async Iteration

\`\`\`javascript
// ─── for await...of ─── untuk async iterable
async function prosesStream(stream) {
    for await (const chunk of stream) {
        console.log("Menerima chunk:", chunk);
    }
}

// ─── Async generator ───
async function* ambilHalamanDemi() {
    let halaman = 1;
    while (true) {
        const res  = await fetch(\`/api/produk?page=\${halaman}\`);
        const data = await res.json();

        if (data.items.length === 0) break;   // Tidak ada lagi

        yield data.items;
        halaman++;
    }
}

// Pakai async generator
for await (const items of ambilHalamanDemi()) {
    console.log(\`Batch \${items.length} produk diterima\`);
    await prosesItems(items);
}

// ─── Paginated fetch helper ───
async function fetchAllPages(url) {
    const semua = [];
    let nextUrl = url;

    while (nextUrl) {
        const res  = await fetch(nextUrl);
        const data = await res.json();
        semua.push(...data.items);
        nextUrl = data.nextPage;    // null kalau halaman terakhir
    }

    return semua;
}
\`\`\`

---

## 🛡️ Error Handling Async yang Proper

\`\`\`javascript
// ─── Helper: bungkus async dan return [error, data] ───
// Terinspirasi dari Go lang, menghindari try-catch berulang
async function safely(promise) {
    try {
        const data = await promise;
        return [null, data];
    } catch (err) {
        return [err, null];
    }
}

// Penggunaan — lebih bersih dari try-catch di mana-mana
async function prosesOrder(orderId) {
    const [errUser, user] = await safely(fetchUser(orderId));
    if (errUser) return console.error("Gagal ambil user:", errUser.message);

    const [errOrder, order] = await safely(fetchOrder(orderId));
    if (errOrder) return console.error("Gagal ambil order:", errOrder.message);

    return { user, order };
}

// ─── Retry logic ───
async function fetchWithRetry(url, maxRetry = 3) {
    for (let i = 1; i <= maxRetry; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
            return await res.json();
        } catch (err) {
            if (i === maxRetry) throw err;  // Sudah habis retry

            const delay = i * 1000;  // Exponential-ish: 1s, 2s, 3s
            console.log(\`Retry \${i}/\${maxRetry} setelah \${delay}ms...\`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// ─── Abort fetch (batalkan request) ───
async function fetchDenganBatal() {
    const controller = new AbortController();
    const { signal } = controller;

    // Batalkan setelah 5 detik
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch("/api/lambat", { signal });
        clearTimeout(timeout);
        return await res.json();
    } catch (err) {
        if (err.name === "AbortError") {
            console.log("Request dibatalkan!");
        } else {
            throw err;
        }
    }
}
\`\`\`

---

## 🎯 Praktik: Async Queue Processor

\`\`\`javascript
// Proses banyak task async dengan kontrol concurrency
class AsyncQueue {
    #queue = [];
    #running = 0;
    #maxConcurrent;

    constructor(maxConcurrent = 3) {
        this.#maxConcurrent = maxConcurrent;
    }

    async add(taskFn) {
        return new Promise((resolve, reject) => {
            this.#queue.push({ taskFn, resolve, reject });
            this.#process();
        });
    }

    async #process() {
        if (this.#running >= this.#maxConcurrent) return;
        const task = this.#queue.shift();
        if (!task) return;

        this.#running++;
        try {
            const result = await task.taskFn();
            task.resolve(result);
        } catch (err) {
            task.reject(err);
        } finally {
            this.#running--;
            this.#process();  // Proses task berikutnya
        }
    }
}

// Test
const queue = new AsyncQueue(2);  // Maks 2 task sekaligus

const tasks = Array.from({ length: 8 }, (_, i) =>
    queue.add(async () => {
        console.log(\`Task \${i} mulai...\`);
        await new Promise(r => setTimeout(r, Math.random() * 1000));
        console.log(\`Task \${i} selesai!\`);
        return \`Hasil task \${i}\`;
    })
);

const results = await Promise.all(tasks);
console.log("Semua selesai:", results);
\`\`\`

---

## 📝 Ringkasan

- **Promise.all**: paralel, gagal kalau satu gagal — untuk request yang saling dependen
- **Promise.allSettled**: paralel, tidak peduli gagal — untuk request independen
- **Promise.race**: ambil yang paling cepat — cocok untuk timeout
- **Promise.any**: ambil yang pertama sukses — untuk fallback/redundancy
- **for await...of**: iterasi async secara sequential
- **Async generator** (\`async function*\`): produce nilai async satu per satu
- **AbortController**: batalkan fetch yang sedang berjalan

> **Selanjutnya: JavaScript di Node.js — jalankan JavaScript di server!** 🚀
`;
