import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { WalletBalanceCard } from "@/components/dashboard/WalletBalanceCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";

export function DashboardPage({
  activeTab = "beranda",
  onSelectTab,
  onLogout,
  onHelpClick,
  walletSummary,
  activities,
}) {
  return (
    // <div className="flex min-h-screen bg-[#f7f9f8] text-slate-900">
    //   <main className="flex-1 px-6 py-7 lg:px-10">

    //   </main>
    // </div>
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Personal Wallet"
        title="Beranda"
        subtitle="Selasa, 17 November 2026 • Selamat datang kembali."
        userName={walletSummary.userName}
        initials={walletSummary.initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <WalletBalanceCard
            balanceFormatted={walletSummary.balanceFormatted}
            walletNumber={walletSummary.walletNumber}
            status={walletSummary.status}
          />
        </div>
        <div className="lg:col-span-4">
          <QuickActionsCard
            onTopUp={() => onSelectTab?.("isi-saldo")}
            onTransfer={() => onSelectTab?.("transfer")}
          />
        </div>
      </div>

      <RecentTransactionsCard
        activities={activities}
        onViewAll={() => onSelectTab?.("aktivitas")}
      />
    </div>
  );
}
