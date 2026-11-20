import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { WalletBalanceCard } from "@/components/dashboard/WalletBalanceCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import "./App.css";

const SAMPLE_TRANSACTIONS = [
  {
    id: "1",
    title: "Top up via QRIS",
    date: "17 Nov 2026",
    amountFormatted: "+ Rp250.000",
    isPositive: true,
    status: "SUCCESS",
  },
  {
    id: "2",
    title: "Transfer to Bima",
    date: "16 Nov 2026",
    amountFormatted: "- Rp75.000",
    isPositive: false,
    status: "SUCCESS",
  },
  {
    id: "3",
    title: "Transfer from Rina",
    date: "15 Nov 2026",
    amountFormatted: "+ Rp120.000",
    isPositive: true,
    status: "SUCCESS",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onLogout={() => console.log("Logout clicked")}
      />

      <main className="flex-1 px-6 py-7 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <TopHeader userName="Nadia" initials="NP" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <WalletBalanceCard
                balanceFormatted="Rp1.250.000"
                walletCode="KW-****-1842"
                status="ACTIVE"
              />
            </div>
            <div className="lg:col-span-4">
              <QuickActionsCard
                onTopUp={() => setActiveTab("topup")}
                onTransfer={() => setActiveTab("transfer")}
              />
            </div>
          </div>

          <RecentTransactionsCard
            transactions={SAMPLE_TRANSACTIONS}
            onViewAll={() => setActiveTab("transactions")}
          />
        </div>
      </main>
    </div>
  );
}
