import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";
import { cn } from "@/lib/utils";

const DEFAULT_USER = {
  id: "1",
  name: "Nadia Putri",
  handle: "@nadia",
  email: "nadia@example.com",
  phone: "0812 3456 7890",
  walletNumber: "KW •••• 1842",
  joinedAt: "10 November 2026",
  status: "Aktif",
};

export function AdminUserDetailPage({
  user = DEFAULT_USER,
  onBackToList,
  onToggleSuspend,
}) {
  const [status, setStatus] = useState(user.status || "Aktif");

  const initials = (user.name || "NP")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const isSuspended = status === "Ditangguhkan";

  const handleToggle = () => {
    const nextStatus = isSuspended ? "Aktif" : "Ditangguhkan";
    setStatus(nextStatus);
    onToggleSuspend?.(user, nextStatus);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AdminTopHeader
        eyebrow="Pengelolaan Akun"
        title="Detail pengguna"
        subtitle="Informasi akun customer dan status aksesnya."
        adminLabel="Admin"
        initials="AD"
      />

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
                {status}
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
                <dd className="font-semibold text-slate-800">
                  {user.walletNumber}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-400">Terdaftar sejak</dt>
                <dd className="font-semibold text-slate-800">
                  {user.joinedAt}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
            <CardContent className="px-6">
              <h2 className="text-base font-bold text-slate-900">
                Status akun
              </h2>

              <div className="mt-4">
                <span
                  className={cn(
                    "inline-flex rounded-md px-3 py-1 text-[11px] font-semibold",
                    isSuspended
                      ? "bg-rose-50 text-rose-500"
                      : "bg-[#edf6f4] text-[#0d5c52]",
                  )}
                >
                  {status}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                Menangguhkan akun akan membatasi akses dan transaksi.
              </p>

              <Button
                type="button"
                onClick={handleToggle}
                className={cn(
                  "mt-6 h-11 w-full rounded-lg text-xs font-semibold text-white",
                  isSuspended
                    ? "bg-[#0d5c52] hover:bg-[#09473f]"
                    : "bg-[#b44339] hover:bg-[#99362e]",
                )}
              >
                {isSuspended ? "Aktifkan akun" : "Tangguhkan akun"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
