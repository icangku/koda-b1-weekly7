import { Plus, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActionsCard({ onTopUp, onTransfer }) {
  return (
    <Card className="flex h-full flex-col justify-between rounded-2xl border-slate-200/70 bg-white p-5 sm:p-6 shadow-2xs">
      <div>
        <h2 className="text-base font-bold text-slate-900">Aksi cepat</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Transaksi yang sering digunakan
        </p>
      </div>

      <CardContent className="mt-4 flex flex-col gap-2.5 p-0 sm:mt-5">
        <Button
          type="button"
          onClick={onTopUp}
          className="h-10 w-full justify-center gap-2 rounded-lg bg-[#0d5c52] px-4 text-xs font-semibold text-white hover:bg-[#09473f]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Isi Saldo</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onTransfer}
          className="h-10 w-full justify-center gap-2 rounded-lg bg-slate-100/90 px-4 text-xs font-semibold text-slate-800 hover:bg-slate-200/80"
        >
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-600" />
          <span>Transfer</span>
        </Button>
      </CardContent>
    </Card>
  );
}
