import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { TransactionStatusView } from "@/components/dashboard/TransactionStatusView";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export function TransferPage({ onGoToActivities, onGoToDashboard }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "confirm" | "success"
  const [receiverWalletNumber, setReceiverWalletNumber] = useState("");
  const [amountInput, setAmountInput] = useState("75000");
  const [description, setDescription] = useState("");

  const [transferResult, setTransferResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/wallets/me")
      .then((data) => setWallet(data))
      .catch((err) => setError(err.message || "Gagal memuat dompet."));
  }, []);

  const numericAmount = Number(String(amountInput).replace(/[^0-9]/g, "")) || 0;
  const currentBalance = Number(wallet?.balance || 0);
  const remainingBalance = Math.max(0, currentBalance - numericAmount);

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (!receiverWalletNumber.trim()) {
      setError("Nomor dompet penerima wajib diisi.");
      return;
    }
    if (numericAmount <= 0) {
      setError("Nominal transfer harus lebih besar dari 0.");
      return;
    }
    if (numericAmount > currentBalance) {
      setError("Saldo tidak mencukupi untuk melakukan transfer ini.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleExecuteTransfer = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/transfers", {
        method: "POST",
        body: JSON.stringify({
          senderWalletId: wallet.id,
          receiverWalletNumber: receiverWalletNumber.trim(),
          amount: numericAmount,
          description: description.trim() || null,
          senderRowVersion: wallet.rowVersion || null,
        }),
      });

      setTransferResult(res);
      setStep("success");
    } catch (err) {
      setError(err.message || "Transfer gagal dilakukan.");
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
          mode="confirm"
          backLabel="Kembali ke transfer"
          onBack={() => setStep("form")}
          title="Konfirmasi transfer"
          subtitle="Periksa kembali detail sebelum mengirim."
          rows={[
            { label: "Nomor dompet tujuan", value: receiverWalletNumber },
            { label: "Nominal", value: formatRupiah(numericAmount) },
            { label: "Catatan", value: description || "-" },
          ]}
          highlightRow={{
            label: "Sisa saldo setelah transfer",
            value: formatRupiah(remainingBalance),
          }}
          primaryActionLabel={loading ? "Memproses..." : "Konfirmasi transfer"}
          onPrimaryAction={handleExecuteTransfer}
        />
      </div>
    );
  }

  if (step === "success") {
    return (
      <TransactionStatusView
        mode="success"
        title="Transfer berhasil"
        subtitle={`${formatRupiah(numericAmount)} berhasil dikirim ke ${transferResult?.receiverWalletNumber || receiverWalletNumber}.`}
        referenceNumber={transferResult?.referenceNo || "-"}
        currentBalanceText={formatRupiah(transferResult?.senderBalanceAfter ?? remainingBalance)}
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
        title="Transfer saldo"
        subtitle="Kirim saldo dengan aman ke pengguna KodaWallet lain."
        userName={user?.fullName || user?.userName || "Pengguna"}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-7">
            <h2 className="text-base font-bold text-slate-900">
              Detail transfer
            </h2>

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleProceedToConfirm} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="receiver"
                  className="block text-xs font-medium text-slate-500"
                >
                  Nomor dompet penerima
                </label>
                <input
                  id="receiver"
                  type="text"
                  required
                  value={receiverWalletNumber}
                  onChange={(e) => setReceiverWalletNumber(e.target.value)}
                  placeholder="Contoh: WALLET-12345678"
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-xs font-medium text-slate-500"
                >
                  Nominal transfer (Rp)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1000"
                  step="1000"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="75000"
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="note"
                  className="block text-xs font-medium text-slate-500"
                >
                  Catatan (opsional)
                </label>
                <input
                  id="note"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bayar makan siang, belanja, dll."
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <Button
                type="submit"
                disabled={!receiverWalletNumber.trim() || numericAmount <= 0}
                className="h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f] disabled:opacity-50"
              >
                Lanjutkan
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5 lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white p-6 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase">
              Informasi Dompet Pengirim
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
