import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RecentUsersCard({ users = [], onViewAll }) {
  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-6 shadow-2xs">
      <div className="mb-3 flex items-center justify-between gap-4 px-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">Pengguna terbaru</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0d5c52] hover:underline"
        >
          Lihat semua →
        </button>
      </div>

      <CardContent className="divide-y divide-slate-100 px-4 sm:px-6 pb-0">
        {users.map((user) => {
          const isSuspended = user.status === "Ditangguhkan";
          return (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 py-3.5 sm:grid sm:grid-cols-12 sm:gap-4"
            >
              <div className="min-w-0 flex-1 sm:col-span-4">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-400 sm:hidden">
                  {user.email}
                </p>
              </div>

              <div className="hidden text-xs text-slate-400 sm:block sm:col-span-5">
                {user.email}
              </div>

              <div className="text-right sm:col-span-3">
                <span
                  className={cn(
                    "inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold",
                    isSuspended
                      ? "bg-rose-50 text-rose-500"
                      : "bg-[#edf6f4] text-[#0d5c52]",
                  )}
                >
                  {user.status}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
