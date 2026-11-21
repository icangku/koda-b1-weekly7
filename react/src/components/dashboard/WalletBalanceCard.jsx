import { Card, CardContent } from "@/components/ui/card";

export function WalletBalanceCard({
  balanceFormatted = "Rp 1.250.000",
  walletNumber = "KW •••• 1842",
  status = "Aktif",
}) {
  return (
    <Card className="h-full rounded-2xl border-0 bg-[#0d5c52] py-0 text-white shadow-2xs">
      <CardContent className="flex h-full flex-col justify-between p-7">
        <p className="text-[11px] font-semibold tracking-widest text-emerald-100/80 uppercase">
          Saldo Tersedia
        </p>

        <div className="my-5 text-4xl font-bold tracking-tight sm:text-[42px]">
          {balanceFormatted}
        </div>

        <div className="space-y-3">
          <p className="text-xs text-emerald-100/85">
            Nomor dompet ·{" "}
            <span className="font-medium text-white">{walletNumber}</span>
          </p>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0d5c52]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
