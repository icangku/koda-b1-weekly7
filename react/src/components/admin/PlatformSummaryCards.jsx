import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PlatformSummaryCards({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs"
        >
          <CardContent className="px-6">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </p>
            <p
              className={cn(
                "mt-3 text-xs font-medium",
                stat.accentType === "warning"
                  ? "text-amber-700"
                  : "text-[#0d5c52]",
              )}
            >
              {stat.helper}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
