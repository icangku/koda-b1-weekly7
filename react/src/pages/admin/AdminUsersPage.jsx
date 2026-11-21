import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { cn } from "@/lib/utils";

const DEFAULT_USERS = [
  {
    id: "1",
    name: "Nadia Putri",
    handle: "@nadia",
    email: "nadia@example.com",
    phone: "0812 3456 7890",
    walletNumber: "KW •••• 1842",
    joinedAt: "10 November 2026",
    status: "Aktif",
  },
  {
    id: "2",
    name: "Bima Pratama",
    handle: "@bima",
    email: "bima@example.com",
    phone: "0812 9876 5432",
    walletNumber: "KW •••• 2941",
    joinedAt: "11 November 2026",
    status: "Aktif",
  },
  {
    id: "3",
    name: "Rina Maharani",
    handle: "@rina",
    email: "rina@example.com",
    phone: "0813 1122 3344",
    walletNumber: "KW •••• 3019",
    joinedAt: "12 November 2026",
    status: "Aktif",
  },
  {
    id: "4",
    name: "Hendra Wijaya",
    handle: "@hendra",
    email: "hendra@example.com",
    phone: "0856 7788 9900",
    walletNumber: "KW •••• 4410",
    joinedAt: "08 November 2026",
    status: "Ditangguhkan",
  },
  {
    id: "5",
    name: "Dian Ayu",
    handle: "@dian",
    email: "dian@example.com",
    phone: "0878 5566 7788",
    walletNumber: "KW •••• 5128",
    joinedAt: "14 November 2026",
    status: "Aktif",
  },
];

export function AdminUsersPage({
  users = DEFAULT_USERS,
  totalAccounts = 1248,
  onSelectUser,
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredUsers = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Pengelolaan Akun"
        title="Pengguna"
        subtitle="Kelola akun customer, status, dan akses aplikasi."
        adminLabel="Admin"
        initials="AD"
      />

      <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs">
        <CardContent className="px-7">
          <h2 className="text-base font-bold text-slate-900">
            Daftar pengguna
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Temukan akun berdasarkan nama, username, atau email.
          </p>

          {/* Search & Filter */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-8">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pengguna..."
                className="h-11 w-full rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="relative md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3.5 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua status</option>
                <option value="Aktif">Aktif</option>
                <option value="Ditangguhkan">Ditangguhkan</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3.5 right-3 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="button"
              className="flex h-11 items-center justify-center rounded-lg bg-[#f2f8f6] px-4 text-xs font-semibold text-[#0d5c52] transition-colors hover:bg-[#e5f2ee] md:col-span-2"
            >
              Filter
            </button>
          </div>

          {/* Table Header */}
          <div className="mt-7 hidden grid-cols-12 gap-4 border-b border-slate-100 pb-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase sm:grid">
            <div className="sm:col-span-4">Pengguna</div>
            <div className="sm:col-span-4">Email</div>
            <div className="sm:col-span-2">Status</div>
            <div className="sm:col-span-2 sm:text-right">Aksi</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const isSuspended = user.status === "Ditangguhkan";
              return (
                <div
                  key={user.id}
                  className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-12 sm:gap-4"
                >
                  <div className="sm:col-span-4">
                    <p className="text-sm font-bold text-slate-900">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {user.handle}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 sm:col-span-4">
                    {user.email}
                  </div>

                  <div className="sm:col-span-2">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-3 py-1 text-[11px] font-semibold",
                        isSuspended
                          ? "bg-rose-50 text-rose-500"
                          : "bg-[#edf6f4] text-[#0d5c52]",
                      )}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="sm:col-span-2 sm:text-right">
                    <button
                      type="button"
                      onClick={() => onSelectUser?.(user)}
                      className="text-xs font-semibold text-[#0d5c52] hover:underline"
                    >
                      Detail →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Menampilkan {filteredUsers.length} dari {totalAccounts} akun
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
