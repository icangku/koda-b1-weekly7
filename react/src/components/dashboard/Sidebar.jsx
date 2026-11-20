import {
  LayoutDashboard,
  PlusCircle,
  ArrowLeftRight,
  History,
  User,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "topup", label: "Top Up", icon: PlusCircle },
  { id: "transfer", label: "Transfer", icon: ArrowLeftRight },
  { id: "transactions", label: "Transactions", icon: History },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar({ activeTab = "dashboard", onSelectTab, onLogout }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0b1324] text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/25 bg-white/5 text-white">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          KodaWallet
        </span>
      </div>

      <div className="px-5 pt-2 pb-2">
        <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Personal Wallet
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab?.(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
