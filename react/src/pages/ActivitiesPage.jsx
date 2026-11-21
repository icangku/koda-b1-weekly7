import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { cn } from "@/lib/utils";

const INITIAL_TRANSACTIONS = [
  {
    id: "1",
    title: "Top up melalui QRIS",
    refCode: "TRX-20261117-1051",
    type: "TOP UP",
    amount: "+ Rp250.000",
    status: "Berhasil",
  },
  {
    id: "2",
    title: "Transfer ke Bima Pratama",
    refCode: "TRX-20261116-1037",
    type: "TRANSFER",
    amount: "- Rp75.000",
    status: "Berhasil",
  },
  {
    id: "3",
    title: "Transfer dari Rina",
    refCode: "TRX-20261115-1004",
    type: "TRANSFER",
    amount: "+ Rp120.000",
    status: "Berhasil",
  },
  {
    id: "4",
    title: "Isi saldo melalui bank",
    refCode: "TRX-20261114-1012",
    type: "TOP UP",
    amount: "+ Rp500.000",
    status: "Berhasil",
  },
];

export function ActivitiesPage({
  userName = "Nadia",
  initials = "NP",
  transactions = INITIAL_TRANSACTIONS,
  totalCount = 24,
}) {
  const [searchRef, setSearchRef] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = transactions.filter((item) => {
    const matchSearch =
      !searchRef.trim() ||
      item.refCode.toLowerCase().includes(searchRef.toLowerCase()) ||
      item.title.toLowerCase().includes(searchRef.toLowerCase());
    const matchType = typeFilter === "ALL" || item.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Riwayat Transaksi"
        title="Aktivitas"
        subtitle="Lihat riwayat transaksi dan mutasi saldo."
        userName={userName}
        initials={initials}
      />

      <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs">
        <CardContent className="px-7">
          <h2 className="text-base font-bold text-slate-900">
            Riwayat transaksi
          </h2>

          {/* Filter Bar */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Cari nomor referensi..."
                className="h-10 w-full rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0d5c52]"
              />
            </div>

            <div className="relative md:col-span-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua tipe</option>
                <option value="TOP UP">TOP UP</option>
                <option value="TRANSFER">TRANSFER</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Semua status</option>
                <option value="Berhasil">Berhasil</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative md:col-span-2">
              <select
                defaultValue="ALL"
                className="h-10 w-full appearance-none rounded-lg border border-slate-200/80 bg-white pr-8 pl-3 text-xs text-slate-700 outline-none focus:border-[#0d5c52]"
              >
                <option value="ALL">Rentang tanggal</option>
                <option value="7D">7 hari terakhir</option>
                <option value="30D">30 hari terakhir</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Table Header */}
          <div className="mt-7 hidden grid-cols-12 gap-4 border-b border-slate-100 pb-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase sm:grid">
            <div className="sm:col-span-5">Transaksi</div>
            <div className="sm:col-span-3">Jenis</div>
            <div className="sm:col-span-2 sm:text-right">Nominal</div>
            <div className="sm:col-span-2 sm:text-right">Status</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-12 sm:gap-4"
              >
                <div className="sm:col-span-5">
                  <p className="text-sm font-bold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {item.refCode}
                  </p>
                </div>

                <div className="text-[11px] font-medium tracking-wide text-slate-400 uppercase sm:col-span-3">
                  {item.type}
                </div>

                <div className="text-xs font-bold text-slate-900 sm:col-span-2 sm:text-right">
                  {item.amount}
                </div>

                <div className="sm:col-span-2 sm:text-right">
                  <span className="inline-flex rounded-md bg-[#edf6f4] px-2.5 py-1 text-[11px] font-semibold text-[#0d5c52]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Pagination */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400">
              Menampilkan {filtered.length} dari {totalCount} transaksi
            </p>

            <div className="flex items-center gap-2 rounded-lg bg-[#f4f7f6] px-3.5 py-2 text-xs font-semibold text-[#0d5c52]">
              {[1, 2, 3].map((p, idx) => (
                <span key={p} className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(p)}
                    className={cn(
                      "px-1",
                      page === p
                        ? "underline underline-offset-4"
                        : "opacity-80 hover:opacity-100",
                    )}
                  >
                    {p}
                  </button>
                  {idx < 2 && <span className="text-slate-300">·</span>}
                </span>
              ))}
              <button
                type="button"
                onClick={() => setPage((prev) => (prev < 3 ? prev + 1 : 1))}
                className="ml-1 hover:translate-x-0.5 transition-transform"
              >
                →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
