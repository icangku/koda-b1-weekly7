import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminUserDetailPage({ userId, onBackToList }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUser = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`/api/users/${userId}`);
      setUser({
        id: String(data.id),
        name: data.fullName || data.username,
        handle: `@${data.username}`,
        email: data.email,
        phone: data.phone,
        walletNumber: data.walletNumber || "-",
        balance: data.balance,
        status:
          String(data.status).toUpperCase() === "ACTIVE" || data.status === 0
            ? "Aktif"
            : "Ditangguhkan",
        raw: data,
      });
    } catch (err) {
      setError(err.message || "Gagal memuat detail user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  const handleToggleSuspend = async () => {
    if (!user) return;
    const isSuspended = user.status === "Ditangguhkan";
    const nextBackendStatus = isSuspended ? "Active" : "Suspended";

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: user.raw?.fullName || user.name,
          email: user.raw?.email || user.email,
          phone: user.raw?.phone || user.phone,
          status: nextBackendStatus,
        }),
      });

      setSuccess(`Status user berhasil diubah menjadi ${isSuspended ? "Aktif" : "Ditangguhkan"}.`);
      await loadUser();
    } catch (err) {
      setError(err.message || "Gagal memperbarui status user.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d5c52] border-t-transparent" />
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <button
          type="button"
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d5c52] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke daftar</span>
        </button>
        <div className="rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-600">
          {error || "Pengguna tidak ditemukan."}
        </div>
      </div>
    );
  }

  const isSuspended = user.status === "Ditangguhkan";
  const initials = (user.name || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Pengelolaan Akun"
        title="Detail pengguna"
        subtitle="Informasi akun customer dan status aksesnya."
        adminLabel="Admin"
        initials="AD"
      />

      {success && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs font-medium text-[#0d5c52]">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-7">
            <button
              type="button"
              onClick={onBackToList}
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d5c52] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke daftar</span>
            </button>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d5c52] text-sm font-bold text-white">
                  {initials}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {user.name}
                  </h2>
                  <p className="text-xs text-slate-400">{user.handle}</p>
                </div>
              </div>

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

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Nama lengkap</dt>
                <dd className="font-semibold text-slate-800">{user.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Email</dt>
                <dd className="font-semibold text-slate-800">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Telepon</dt>
                <dd className="font-semibold text-slate-800">{user.phone}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Nomor dompet</dt>
                <dd className="font-mono font-semibold text-slate-800">
                  {user.walletNumber}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Saldo dompet</dt>
                <dd className="font-semibold text-slate-800">
                  Rp {Number(user.balance || 0).toLocaleString("id-ID")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-5 lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
            <CardContent className="px-6">
              <h2 className="text-base font-bold text-slate-900">
                Aksi Pengelolaan
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Ubah status akun customer sewaktu-waktu jika diperlukan.
              </p>

              <div className="mt-5">
                <Button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleToggleSuspend}
                  className={cn(
                    "w-full text-xs font-semibold text-white",
                    isSuspended
                      ? "bg-[#0d5c52] hover:bg-[#09473f]"
                      : "bg-rose-600 hover:bg-rose-700",
                  )}
                >
                  {actionLoading
                    ? "Memproses..."
                    : isSuspended
                    ? "Aktifkan Akun"
                    : "Tangguhkan Akun"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
