import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { TransactionStatusView } from "@/components/dashboard/TransactionStatusView";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export function TopUpPage({ onGoToActivities, onGoToDashboard }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [amountInput, setAmountInput] = useState("250000");

  const [step, setStep] = useState("form"); // "form" | "confirm" | "success"
  const [createdTopUp, setCreatedTopUp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const [walletData, methods] = await Promise.all([
          apiFetch("/api/wallets/me"),
          apiFetch("/api/payment-methods"),
        ]);
        setWallet(walletData);
        setPaymentMethods(methods || []);
        if (methods?.length > 0) {
          setSelectedMethodId(methods[0].id);
        }
      } catch (err) {
        setError(err.message || "Gagal memuat metode pembayaran.");
      }
    }
    init();
  }, []);

  const numericAmount = Number(String(amountInput).replace(/[^0-9]/g, "")) || 0;
  const currentBalance = Number(wallet?.balance || 0);
  const afterBalance = currentBalance + numericAmount;

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);
  const isQris = selectedMethod?.code?.toUpperCase().includes("QRIS");

  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setError("Nominal harus lebih dari 0.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const topUpRes = await apiFetch("/api/topups", {
        method: "POST",
        body: JSON.stringify({
          walletId: wallet.id,
          paymentMethodId: selectedMethodId,
          amount: numericAmount,
        }),
      });

      const confirmedRes = await apiFetch(`/api/topups/${topUpRes.id}/confirm`, {
        method: "POST",
      });

      setCreatedTopUp(confirmedRes);
      setStep("success");
    } catch (err) {
      setError(err.message || "Gagal memproses top up.");
    } finally {
      setLoading(false);
    }
  };

  const initials = (user?.fullName || user?.userName || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  if (step === "confirm") {
    return (
      <div>
        {error && (
          <div className="mx-auto max-w-md pt-4">
            <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
              {error}
            </div>
          </div>
        )}
        <TransactionStatusView
          mode={isQris ? "qris" : "confirm"}
          backLabel={isQris ? "Ubah metode pembayaran" : "Kembali ke isi saldo"}
          onBack={() => setStep("form")}
          title={isQris ? "Pembayaran QRIS" : "Konfirmasi isi saldo"}
          subtitle={
            isQris
              ? "Pindai kode QR melalui aplikasi pembayaranmu."
              : "Periksa detail sebelum simulasi pembayaran."
          }
          rows={[
            { label: "Dompet tujuan", value: wallet?.ownerName || user?.fullName || "-" },
            { label: "Nominal isi saldo", value: formatRupiah(numericAmount) },
            { label: "Metode pembayaran", value: selectedMethod?.name || "Metode Pembayaran" },
            ...(isQris ? [{ label: "Biaya admin", value: "Rp 0" }] : []),
          ]}
          highlightRow={{
            label: "Saldo setelah pembayaran",
            value: formatRupiah(afterBalance),
          }}
          primaryActionLabel={
            loading
              ? "Memproses..."
              : isQris
              ? "Simulasikan pembayaran QRIS"
              : "Simulasikan pembayaran"
          }
          onPrimaryAction={handleSimulatePayment}
        />
      </div>
    );
  }

  if (step === "success") {
    return (
      <TransactionStatusView
        mode="success"
        title="Isi saldo berhasil"
        subtitle={`${formatRupiah(numericAmount)} telah ditambahkan ke dompetmu.`}
        referenceNumber={createdTopUp?.referenceNo || "-"}
        currentBalanceText={formatRupiah(createdTopUp?.walletBalance ?? afterBalance)}
        primaryActionLabel="Lihat riwayat transaksi"
        onPrimaryAction={() => onGoToActivities?.()}
        secondaryActionLabel="Kembali ke beranda"
        onSecondaryAction={() => onGoToDashboard?.()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Transaksi"
        title="Isi saldo"
        subtitle="Pilih metode dan masukkan nominal untuk menambah saldo."
        userName={user?.fullName || user?.userName || "Pengguna"}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-4 sm:px-7">
            <h2 className="text-base font-bold text-slate-900">
              Formulir isi saldo
            </h2>

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleProceedToConfirm} className="mt-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-500">
                  Pilih metode pembayaran
                </label>
                <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {paymentMethods.map((m) => {
                    const isSelected = selectedMethodId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethodId(m.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all",
                          isSelected
                            ? "border-[#0d5c52] bg-[#f2f8f6] ring-1 ring-[#0d5c52]"
                            : "border-slate-200 bg-white hover:border-slate-300",
                        )}
                      >
                        <p className="text-sm font-bold text-slate-900">{m.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {isSelected ? "Metode terpilih" : m.providerName || "Simulasi"}
                        </p>
                      </button>
                    );
                  })}
                  {paymentMethods.length === 0 && (
                    <p className="text-xs text-slate-400">Tidak ada metode pembayaran aktif.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="topup-amount"
                  className="block text-xs font-medium text-slate-500"
                >
                  Nominal isi saldo (Rp)
                </label>
                <input
                  id="topup-amount"
                  type="number"
                  min="10000"
                  step="1000"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="250000"
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 250000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(preset))}
                    className="rounded-lg border border-slate-200/80 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {formatRupiah(preset)}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={!selectedMethodId || numericAmount <= 0}
                className="h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f] disabled:opacity-50"
              >
                Lanjutkan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Ringkasan Saldo Saat Ini */}
        <div className="space-y-5 lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white p-6 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase">
              Informasi Dompet
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Saldo saat ini</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatRupiah(currentBalance)}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Nomor dompet</p>
                <p className="text-xs font-semibold text-slate-800">
                  {wallet?.walletNumber || "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
