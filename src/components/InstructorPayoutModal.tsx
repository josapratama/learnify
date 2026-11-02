"use client";

import { useState } from "react";
import {
  Wallet,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface InstructorPayoutModalProps {
  totalRevenue: number;
}

export default function InstructorPayoutModal({
  totalRevenue,
}: InstructorPayoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutResult, setPayoutResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 50000) {
      setError("Nominal minimal penarikan adalah Rp 50.000");
      return;
    }

    if (totalRevenue > 0 && numAmount > totalRevenue) {
      setError(`Nominal melebihi saldo tersedia (Rp ${totalRevenue.toLocaleString("id-ID")})`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/instructor/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName,
          accountNumber,
          accountHolder,
          amount: numAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan penarikan");

      setPayoutResult(data.payout);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem saat penarikan");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setPayoutResult(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-md shadow-emerald-600/20"
      >
        <Wallet className="w-4 h-4" />
        <span>Tarik Saldo</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    Tarik Saldo Pendapatan
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kirim dana ke rekening bank atau dompet digital
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutResult ? (
              /* Success confirmation state */
              <div className="space-y-5 text-center py-2 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Permintaan Berhasil!
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dana sebesar{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {Number(payoutResult.amount).toLocaleString("id-ID")}
                    </span>{" "}
                    sedang dikirim ke rekening Anda.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">No. Referensi:</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {payoutResult.referenceId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tujuan Transfer:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {payoutResult.bankName} - {payoutResult.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Nama Penerima:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {payoutResult.accountHolder}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Estimasi Masuk:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 1x24 Jam Kerja
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:opacity-90 transition"
                >
                  Selesai
                </button>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Available Balance Box */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Saldo Siap Ditarik
                    </span>
                    <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
                      Rp {totalRevenue.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Bank Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Bank / E-Wallet Tujuan
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="BCA">BCA (Bank Central Asia)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                    <option value="BNI">BNI (Bank Negara Indonesia)</option>
                    <option value="CIMB Niaga">CIMB Niaga</option>
                    <option value="Seabank">SeaBank</option>
                    <option value="Bank Jago">Bank Jago</option>
                    <option value="GoPay">GoPay</option>
                    <option value="Dana">DANA</option>
                    <option value="OVO">OVO</option>
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Rekening / No. HP E-Wallet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nama Pemilik Rekening (Sesuai Buku Tabungan / Akun)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Pratama"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Nominal Penarikan (Rp)
                    </label>
                    <span className="text-[10px] text-gray-400">Min. Rp 50.000</span>
                  </div>
                  <input
                    type="number"
                    min="50000"
                    step="10000"
                    required
                    placeholder="50000"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />

                  {/* Quick percentage buttons */}
                  {totalRevenue >= 50000 && (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setAmount(50000)}
                        className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition"
                      >
                        Rp 50rb
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount(Math.floor(totalRevenue / 2))}
                        className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount(totalRevenue)}
                        className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition"
                      >
                        Semua Saldo
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || (totalRevenue < 50000 && totalRevenue > 0)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {loading ? "Memproses..." : "Konfirmasi & Tarik Saldo"}
                  </button>
                  {totalRevenue < 50000 && totalRevenue > 0 && (
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      * Saldo Anda belum mencapai batas minimum penarikan Rp 50.000
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

