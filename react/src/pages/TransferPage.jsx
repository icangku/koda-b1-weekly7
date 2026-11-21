import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { TransactionStatusView } from "@/components/dashboard/TransactionStatusView";

export function TransferPage({
  userName = "Nadia",
  initials = "NP",
  currentBalance = 1250000,
  onGoToActivities,
  onGoToDashboard,
}) {
  const [step, setStep] = useState("form"); // "form" | "confirm" | "success"
  const [searchQuery, setSearchQuery] = useState("bima");
  const [amountText, setAmountText] = useState("Rp 75.000");
  const [note, setNote] = useState("Bayar makan siang");

  const recipient = {
    name: "Bima Pratama",
    initials: "BP",
    handle: "@bima",
    wallet: "KW •••• 2941",
  };

  const numericAmount =
    Number(String(amountText).replace(/[^0-9]/g, "")) || 75000;
  const remainingBalance = Math.max(0, currentBalance - numericAmount);

  const formatRupiah = (val) => `Rp ${val.toLocaleString("id-ID")}`;

  if (step === "confirm") {
    return (
      <TransactionStatusView
        mode="confirm"
        backLabel="Kembali ke transfer"
        onBack={() => setStep("form")}
        title="Konfirmasi transfer"
        subtitle="Periksa kembali detail sebelum mengirim."
        rows={[
          { label: "Penerima", value: recipient.name },
          { label: "Nominal", value: formatRupiah(numericAmount) },
          { label: "Catatan", value: note || "-" },
        ]}
        highlightRow={{
          label: "Sisa saldo setelah transfer",
          value: formatRupiah(remainingBalance),
        }}
        primaryActionLabel="Konfirmasi transfer"
        onPrimaryAction={() => setStep("success")}
      />
    );
  }

  if (step === "success") {
    return (
      <TransactionStatusView
        mode="success"
        title="Transfer berhasil"
        subtitle={`${formatRupiah(numericAmount)} berhasil dikirim ke ${recipient.name}.`}
        referenceNumber="TRX-20261118-0012"
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
        userName={userName}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-7">
            <h2 className="text-base font-bold text-slate-900">
              Detail transfer
            </h2>

            <p className="mt-5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Penerima
            </p>

            <div className="mt-2.5 space-y-2">
              <label
                htmlFor="recipient-search"
                className="block text-xs font-medium text-slate-500"
              >
                Cari username / nomor dompet
              </label>
              <input
                id="recipient-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
              />
            </div>

            {/* Recipient Preview Card */}
            <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#f4faf8] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d5c52] text-xs font-bold text-white">
                  {recipient.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {recipient.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {recipient.handle} · {recipient.wallet}
                  </p>
                </div>
              </div>
              <Check className="h-4 w-4 text-[#0d5c52]" />
            </div>

            <div className="mt-6 space-y-2">
              <label
                htmlFor="transfer-amount"
                className="block text-xs font-medium text-slate-500"
              >
                Nominal transfer
              </label>
              <input
                id="transfer-amount"
                type="text"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="mt-5 space-y-2">
              <label
                htmlFor="transfer-note"
                className="block text-xs font-medium text-slate-500"
              >
                Catatan (opsional)
              </label>
              <input
                id="transfer-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <Button
              type="button"
              onClick={() => setStep("confirm")}
              className="mt-7 h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f]"
            >
              Tinjau transfer
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
            <CardContent className="px-6">
              <h2 className="text-base font-bold text-slate-900">
                Dompet saya
              </h2>

              <p className="mt-5 text-xs text-slate-400">Saldo tersedia</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {formatRupiah(currentBalance)}
              </p>

              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">
                Pastikan penerima dan nominal sudah benar sebelum melanjutkan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
