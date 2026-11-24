import { useState, useEffect } from "react";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { WalletBalanceCard } from "@/components/dashboard/WalletBalanceCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

function formatRupiah(amount) {
  return `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage({ onSelectTab }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const walletData = await apiFetch("/api/wallets/me");
      setWallet(walletData);

      if (walletData?.id) {
        const txRes = await apiFetch(`/api/wallets/${walletData.id}/transactions?pageSize=5`);
        const items = txRes.items || txRes || [];
        const formatted = items.map((item) => {
          const typeUpper = String(item.type || "").toUpperCase();
          const dirUpper = String(item.direction || "").toUpperCase();
          const isTopUp = typeUpper === "TOPUP" || item.type === 0;
          const isIncoming = isTopUp || dirUpper === "IN" || item.direction === 0;
          return {
            id: String(item.id),
            title: isTopUp
              ? "Top up saldo"
              : isIncoming
              ? `Transfer dari ${item.senderWalletNumber || "-"}`
              : `Transfer ke ${item.receiverWalletNumber || "-"}`,
            timestamp: formatDate(item.createdAtUtc),
            refCode: item.referenceNo,
            category: isIncoming ? "Pemasukan" : "Pengeluaran",
            type: isTopUp ? "TOP UP" : "TRANSFER",
            amountFormatted: `${isIncoming ? "+" : "-"} ${formatRupiah(item.amount)}`,
            status:
              String(item.status).toUpperCase() === "SUCCESS" || item.status === 1
                ? "Berhasil"
                : String(item.status).toUpperCase() === "FAILED" || item.status === 2
                ? "Gagal"
                : "Menunggu",
          };
        });
        setActivities(formatted);
      }
    } catch (err) {
      setError(err.message || "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const initials = (user?.fullName || user?.userName || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const balanceFormatted = formatRupiah(wallet?.balance);
  const walletNumber = wallet?.walletNumber || "-";
  const walletStatus =
    String(wallet?.status).toUpperCase() === "ACTIVE" || wallet?.status === 0
      ? "Aktif"
      : "Ditangguhkan";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Personal Wallet"
        title="Beranda"
        subtitle="Selamat datang kembali."
        userName={user?.fullName || user?.userName || "Pengguna"}
        initials={initials}
      />

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d5c52] border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <WalletBalanceCard
                balanceFormatted={balanceFormatted}
                walletNumber={walletNumber}
                status={walletStatus}
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
        </>
      )}
    </div>
  );
}
