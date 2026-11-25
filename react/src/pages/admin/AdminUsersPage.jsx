import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminUsersPage({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("pageSize", pageSize);
      if (query.trim()) params.append("search", query.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await apiFetch(`/api/users?${params.toString()}`);
      const items = res.items || [];
      const total = res.totalCount ?? items.length;

      setUsers(
        items.map((u) => ({
          id: String(u.id),
          name: u.fullName || u.username,
          handle: `@${u.username}`,
          email: u.email,
          phone: u.phone,
          walletNumber: u.walletNumber || "-",
          balance: u.balance,
          status:
            String(u.status).toUpperCase() === "ACTIVE" || u.status === 0
              ? "Aktif"
              : "Ditangguhkan",
          raw: u,
        }))
      );
      setTotalAccounts(total);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const totalPages = Math.max(1, Math.ceil(totalAccounts / pageSize));

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Pengelolaan Akun"
        title="Pengguna"
        subtitle="Kelola akun customer, status, dan akses aplikasi."
        adminLabel="Admin"
        initials="AD"
      />

      <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-7 shadow-2xs">
        <CardContent className="px-4 sm:px-7">
          <h2 className="text-base font-bold text-slate-900">
            Daftar pengguna
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Temukan akun berdasarkan nama, username, atau email.
          </p>

          {/* Search & Filter */}
          <form onSubmit={handleSearchSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-8">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pengguna berdasarkan nama, username, email... (tekan enter)"
                className="h-10 w-full rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="relative sm:col-span-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua status</option>
                <option value="Active">Aktif</option>
                <option value="Suspended">Ditangguhkan</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
              {error}
            </div>
          )}

          {/* Table List */}
          <div className="mt-6 divide-y divide-slate-100">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#0d5c52] border-t-transparent" />
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada pengguna ditemukan.
              </div>
            ) : (
              users.map((user) => {
                const isSuspended = user.status === "Ditangguhkan";
                return (
                  <div
                    key={user.id}
                    onClick={() => onSelectUser?.(user)}
                    className="flex cursor-pointer items-center justify-between gap-3 py-3.5 transition-colors hover:bg-slate-50/70 sm:grid sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="min-w-0 flex-1 sm:col-span-4">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {user.handle} <span className="sm:hidden">· {user.email}</span>
                      </p>
                    </div>

                    <div className="hidden text-xs text-slate-500 sm:block sm:col-span-4">
                      <p className="truncate">{user.email}</p>
                      <p className="mt-0.5 text-slate-400">{user.phone}</p>
                    </div>

                    <div className="hidden text-xs text-slate-500 sm:block sm:col-span-2">
                      <span className="font-mono">{user.walletNumber}</span>
                    </div>

                    <div className="text-right sm:col-span-2">
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
              })
            )}
          </div>

          {/* Pagination Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
              Menampilkan {users.length} dari {totalAccounts} akun
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
