import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

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

export function ActivitiesPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [searchRef, setSearchRef] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/wallets/me")
      .then((data) => setWallet(data))
      .catch((err) => setError(err.message || "Gagal memuat dompet."));
  }, []);

  const fetchTransactions = async () => {
    if (!wallet?.id) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("pageSize", pageSize);
      if (searchRef.trim()) params.append("search", searchRef.trim());
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await apiFetch(`/api/wallets/${wallet.id}/transactions?${params.toString()}`);
      const items = res.items || (Array.isArray(res) ? res : []);
      const count = res.totalCount !== undefined ? res.totalCount : items.length;

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
          amount: `${isIncoming ? "+" : "-"} ${formatRupiah(item.amount)}`,
          status:
            String(item.status).toUpperCase() === "SUCCESS" || item.status === 1
              ? "Berhasil"
              : String(item.status).toUpperCase() === "FAILED" || item.status === 2
              ? "Gagal"
              : "Menunggu",
        };
      });

      setTransactions(formatted);
      setTotalCount(count);
    } catch (err) {
      setError(err.message || "Gagal memuat aktivitas transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet?.id) {
      fetchTransactions();
    }
  }, [wallet?.id, page, typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const initials = (user?.fullName || user?.userName || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Riwayat Transaksi"
        title="Aktivitas"
        subtitle="Lihat riwayat transaksi dan mutasi saldo."
        userName={user?.fullName || user?.userName || "Pengguna"}
        initials={initials}
      />

      <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-7 shadow-2xs">
        <CardContent className="px-4 sm:px-7">
          <h2 className="text-base font-bold text-slate-900">
            Riwayat transaksi
          </h2>

          {/* Filter Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Cari nomor referensi... (tekan enter)"
                className="h-10 w-full rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="relative sm:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua tipe</option>
                <option value="TopUp">TOP UP</option>
                <option value="Transfer">TRANSFER</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua status</option>
                <option value="Success">Berhasil</option>
                <option value="Pending">Menunggu</option>
                <option value="Failed">Gagal</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
              {error}
            </div>
          )}

          {/* List Transaksi */}
          <div className="mt-6 divide-y divide-slate-100">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#0d5c52] border-t-transparent" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada riwayat transaksi ditemukan.
              </div>
            ) : (
              transactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3.5 sm:grid sm:grid-cols-12 sm:gap-4"
                >
                  <div className="min-w-0 flex-1 sm:col-span-5">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {item.timestamp} <span className="sm:hidden">· {item.category}</span> · {item.refCode}
                    </p>
                  </div>

                  <div className="hidden text-xs text-slate-500 sm:block sm:col-span-2">
                    {item.category}
                  </div>

                  <div className="text-right sm:col-span-3">
                    <p className="text-xs font-bold text-slate-900 sm:text-sm">
                      {item.amount}
                    </p>
                  </div>

                  <div className="text-right sm:col-span-2">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold",
                        item.status === "Berhasil"
                          ? "bg-[#edf6f4] text-[#0d5c52]"
                          : item.status === "Gagal"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
              Menampilkan {transactions.length} dari {totalCount} transaksi
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Sebelumnya"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center justify-center rounded-md border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="flex items-center px-2 font-medium">
                Halaman {page} dari {totalPages}
              </span>
              <button
                type="button"
                aria-label="Selanjutnya"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center justify-center rounded-md border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
