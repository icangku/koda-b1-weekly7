import { useState, useEffect } from "react";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { PlatformSummaryCards } from "@/components/admin/PlatformSummaryCards";
import { RecentUsersCard } from "@/components/admin/RecentUsersCard";
import { apiFetch } from "@/lib/api";

export function AdminOverviewPage({ onViewAllUsers }) {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch("/api/users?page=1&pageSize=5");
        const total = res.totalCount ?? 0;
        const active = res.activeCount ?? 0;
        const suspended = res.suspendedCount ?? 0;

        const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : "0";

        setStats([
          {
            id: "total",
            label: "Total pengguna",
            value: total.toLocaleString("id-ID"),
            helper: "Terdaftar dalam sistem",
            accentType: "success",
          },
          {
            id: "active",
            label: "Akun aktif",
            value: active.toLocaleString("id-ID"),
            helper: `${activePercentage}% dari seluruh akun`,
            accentType: "success",
          },
          {
            id: "suspended",
            label: "Akun ditangguhkan",
            value: suspended.toLocaleString("id-ID"),
            helper: suspended > 0 ? "Perlu pemantauan" : "Tidak ada akun bermasalah",
            accentType: suspended > 0 ? "warning" : "success",
          },
        ]);

        const items = res.items || [];
        setRecentUsers(
          items.map((u) => ({
            id: String(u.id),
            name: u.fullName || u.username,
            email: u.email,
            status:
              String(u.status).toUpperCase() === "ACTIVE" || u.status === 0
                ? "Aktif"
                : "Ditangguhkan",
          }))
        );
      } catch (err) {
        setError(err.message || "Gagal memuat ringkasan admin.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Admin Area"
        title="Ringkasan platform"
        subtitle="Pantau pertumbuhan pengguna dan status akun."
        adminLabel="Admin"
        initials="AD"
      />

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d5c52] border-t-transparent" />
        </div>
      ) : (
        <>
          <PlatformSummaryCards stats={stats} />
          <RecentUsersCard users={recentUsers} onViewAll={onViewAllUsers} />
        </>
      )}
    </div>
  );
}
