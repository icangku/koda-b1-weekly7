import {
  LayoutGrid,
  PlusCircle,
  ArrowLeftRight,
  Clock,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAIN_MENU = [
  { id: "beranda", label: "Beranda", icon: LayoutGrid },
  { id: "isi-saldo", label: "Isi Saldo", icon: PlusCircle },
  { id: "transfer", label: "Transfer", icon: ArrowLeftRight },
  { id: "aktivitas", label: "Aktivitas", icon: Clock },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

export function Sidebar({
  activeTab = "beranda",
  onSelectTab,
  onLogout,
  onHelpClick,
  isAdmin = false,
  onGoToAdmin,
}) {
  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white">
      <div>
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0d5c52] text-sm font-bold text-white">
            k
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            koda <span className="font-semibold text-[#0d5c52]">wallet</span>
          </span>
        </div>

        <div className="px-5 pt-2 pb-2">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Menu Utama
          </p>
        </div>

        <nav className="space-y-1 px-3">
          {MAIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab?.(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#edf6f4] font-semibold text-[#0d5c52]"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#0d5c52]" : "text-slate-400",
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              type="button"
              onClick={onGoToAdmin}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Admin Panel</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Keluar</span>
          </button>
        </nav>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={onHelpClick}
          className="w-full rounded-xl border border-emerald-900/10 bg-[#f2f8f6] p-3.5 text-left transition-colors hover:bg-[#e8f3f0]"
        >
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Butuh Bantuan?
          </p>
          <p className="mt-1 text-xs font-bold text-slate-900">Pusat Bantuan</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Panduan dan informasi akun
          </p>
        </button>
      </div>
    </aside>
  );
}
