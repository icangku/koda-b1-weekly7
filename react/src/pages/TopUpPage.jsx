import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { TransactionStatusView } from "@/components/dashboard/TransactionStatusView";
import { cn } from "@/lib/utils";

const METHODS = [
  {
    id: "bank",
    title: "Transfer bank",
    defaultSubtitle: "Pembayaran simulasi",
    selectedSubtitle: "Metode terpilih · simulasi",
  },
  {
    id: "qris",
    title: "QRIS",
    defaultSubtitle: "Pembayaran simulasi",
    selectedSubtitle: "Metode terpilih · simulasi",
  },
];

export function TopUpPage({
  userName = "Nadia",
  fullName = "Nadia Putri",
  initials = "NP",
  currentBalance = 1250000,
  onGoToActivities,
  onGoToDashboard,
}) {
  const [step, setStep] = useState("form"); // "form" | "confirm" | "success"
  const [amountText, setAmountText] = useState("Rp 250.000");
  const [method, setMethod] = useState("bank");

  const numericAmount =
    Number(String(amountText).replace(/[^0-9]/g, "")) || 250000;
  const afterBalance = currentBalance + numericAmount;

  const formatRupiah = (val) => `Rp ${val.toLocaleString("id-ID")}`;

  if (step === "confirm") {
    if (method === "qris") {
      return (
        <TransactionStatusView
          mode="qris"
          backLabel="Ubah metode pembayaran"
          onBack={() => setStep("form")}
          title="Pembayaran QRIS"
          subtitle="Pindai kode QR melalui aplikasi pembayaranmu."
          rows={[
            { label: "Nominal isi saldo", value: formatRupiah(numericAmount) },
            { label: "Metode pembayaran", value: "QRIS" },
            { label: "Biaya admin", value: "Rp 0" },
          ]}
          highlightRow={{
            label: "Saldo setelah pembayaran",
            value: formatRupiah(afterBalance),
          }}
          primaryActionLabel="Simulasikan pembayaran QRIS"
          onPrimaryAction={() => setStep("success")}
        />
      );
    }

    return (
      <TransactionStatusView
        mode="confirm"
        backLabel="Kembali ke isi saldo"
        onBack={() => setStep("form")}
        title="Konfirmasi isi saldo"
        subtitle="Periksa detail sebelum simulasi pembayaran."
        rows={[
          { label: "Dompet tujuan", value: fullName },
          { label: "Nominal isi saldo", value: formatRupiah(numericAmount) },
          { label: "Metode pembayaran", value: "Transfer bank" },
        ]}
        highlightRow={{
          label: "Saldo setelah pembayaran",
          value: formatRupiah(afterBalance),
        }}
        primaryActionLabel="Simulasikan pembayaran"
        onPrimaryAction={() => setStep("success")}
      />
    );
  }

  if (step === "success") {
    return (
      <TransactionStatusView
        mode="success"
        title="Isi saldo berhasil"
        subtitle={`${formatRupiah(numericAmount)} telah ditambahkan ke dompetmu.`}
        referenceNumber="TOP-20261118-0013"
        currentBalanceText={formatRupiah(afterBalance)}
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
        subtitle="Pilih nominal dan metode pembayaran yang tersedia."
        userName={userName}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-7">
            <h2 className="text-base font-bold text-slate-900">
              Buat permintaan isi saldo
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Saldo baru bertambah setelah pembayaran dikonfirmasi.
            </p>

            <div className="mt-6 space-y-2">
              <label
                htmlFor="topup-amount"
                className="block text-xs font-medium text-slate-500"
              >
                Nominal isi saldo
              </label>
              <input
                id="topup-amount"
                type="text"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="mt-6 space-y-2.5">
              <p className="text-xs font-medium text-slate-500">
                Metode pembayaran
              </p>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {METHODS.map((m) => {
                  const selected = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-colors",
                        selected
                          ? "border-[#0d5c52] bg-[#f4faf8]"
                          : "border-slate-200/80 bg-white hover:border-slate-300",
                      )}
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {m.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {selected ? m.selectedSubtitle : m.defaultSubtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setStep("confirm")}
              className="mt-7 h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f]"
            >
              Lanjutkan pembayaran
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
            <CardContent className="px-6">
              <h2 className="text-base font-bold text-slate-900">
                Ringkasan akun
              </h2>

              <p className="mt-5 text-xs text-slate-400">Saldo saat ini</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {formatRupiah(currentBalance)}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">Status dompet</span>
                <span className="rounded-md bg-[#edf6f4] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#0d5c52] uppercase">
                  Aktif
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
