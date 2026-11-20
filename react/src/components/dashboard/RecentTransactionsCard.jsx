import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecentTransactionsCard({ transactions = [], onViewAll }) {
  return (
    <Card className="rounded-2xl border-0 bg-white p-2 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Transaksi Terbaru
        </CardTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Lihat semua transaksi
        </button>
      </CardHeader>

      <CardContent className="divide-y divide-slate-100">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="grid grid-cols-1 items-center gap-2 py-4 first:pt-2 last:pb-2 sm:grid-cols-12 sm:gap-4"
          >
            <div className="font-semibold text-slate-900 sm:col-span-5">
              {tx.title}
            </div>

            <div className="text-sm text-slate-400 sm:col-span-3">
              {tx.date}
            </div>

            <div
              className={cn(
                "text-sm font-bold sm:col-span-2 sm:text-right",
                tx.isPositive ? "text-emerald-600" : "text-slate-900",
              )}
            >
              {tx.amountFormatted}
            </div>

            <div className="sm:col-span-2 sm:text-right">
              <Badge
                variant="secondary"
                className="rounded-md bg-emerald-100/80 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-700 uppercase hover:bg-emerald-100/80"
              >
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
