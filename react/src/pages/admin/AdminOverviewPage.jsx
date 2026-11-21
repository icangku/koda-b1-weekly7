import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { PlatformSummaryCards } from "@/components/admin/PlatformSummaryCards";
import { RecentUsersCard } from "@/components/admin/RecentUsersCard";

const DEFAULT_STATS = [
  {
    id: "total",
    label: "Total pengguna",
    value: "1.248",
    helper: "+ 28 bulan ini",
    accentType: "success",
  },
  {
    id: "active",
    label: "Akun aktif",
    value: "1.190",
    helper: "95,4% dari seluruh akun",
    accentType: "success",
  },
  {
    id: "suspended",
    label: "Akun ditangguhkan",
    value: "58",
    helper: "Perlu pemantauan",
    accentType: "warning",
  },
];

const DEFAULT_RECENT_USERS = [
  {
    id: "1",
    name: "Nadia Putri",
    email: "nadia@example.com",
    status: "Aktif",
  },
  {
    id: "2",
    name: "Bima Pratama",
    email: "bima@example.com",
    status: "Aktif",
  },
  {
    id: "3",
    name: "Rina Maharani",
    email: "rina@example.com",
    status: "Aktif",
  },
  {
    id: "4",
    name: "Hendra Wijaya",
    email: "hendra@example.com",
    status: "Ditangguhkan",
  },
];

export function AdminOverviewPage({
  stats = DEFAULT_STATS,
  recentUsers = DEFAULT_RECENT_USERS,
  onViewAllUsers,
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Admin Area"
        title="Ringkasan platform"
        subtitle="Pantau pertumbuhan pengguna dan status akun."
        adminLabel="Admin"
        initials="AD"
      />

      <PlatformSummaryCards stats={stats} />

      <RecentUsersCard users={recentUsers} onViewAll={onViewAllUsers} />
    </div>
  );
}
