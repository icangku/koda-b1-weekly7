import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fbfa] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-2xl font-bold text-rose-500">
        403
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Akses Ditolak</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini khusus untuk administrator.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button className="h-10 rounded-lg bg-[#0d5c52] px-6 text-xs font-semibold text-white hover:bg-[#09473f]">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
