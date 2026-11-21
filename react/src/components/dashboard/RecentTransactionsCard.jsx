import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RecentTransactionsCard({ activities = [], onViewAll }) {
  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
      <div className="mb-4 flex items-start justify-between gap-4 px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Aktivitas terakhir
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Pantau pergerakan uang di dompetmu
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0d5c52] hover:underline"
        >
          Lihat semua →
        </button>
      </div>

      <CardContent className="divide-y divide-slate-100 px-6 pb-0">
        {activities.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 items-center gap-2 py-3.5 first:pt-2 last:pb-1 sm:grid-cols-12 sm:gap-4"
          >
            <div className="sm:col-span-5">
              <p className="text-sm font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {item.timestamp}
              </p>
            </div>

            <div className="text-xs text-slate-500 sm:col-span-3">
              {item.category}
            </div>

            <div className="text-xs font-bold text-slate-900 sm:col-span-2 sm:text-right">
              {item.amountFormatted}
            </div>

            <div className="sm:col-span-2 sm:text-right">
              <span
                className={cn(
                  "text-xs font-semibold",
                  item.status === "Berhasil"
                    ? "text-emerald-700"
                    : "text-slate-600",
                )}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
