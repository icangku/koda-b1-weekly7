import { Card } from "@/components/ui/card";

export function WalletBalanceCard({ balanceFormatted, walletCode, status }) {
  return (
    <Card className="h-full rounded-2xl border-0 bg-white p-3 shadow-2xs">
      <div className="flex h-full flex-col justify-between rounded-xl bg-blue-600 p-7 text-white">
        <p className="text-xs font-semibold tracking-widest text-blue-100 uppercase">
          Total Saldo Wallet
        </p>

        <div className="my-5 text-4xl font-bold tracking-tight sm:text-[42px]">
          {balanceFormatted}
        </div>

        <div className="flex items-center gap-3 text-xs font-medium tracking-wider text-blue-100 uppercase">
          <span>{walletCode}</span>
          <span>•</span>
          <span>{status}</span>
        </div>
      </div>
    </Card>
  );
}
