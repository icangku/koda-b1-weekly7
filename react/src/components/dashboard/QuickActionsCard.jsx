import { Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActionsCard({ onTopUp, onTransfer }) {
  return (
    <Card className="h-full rounded-2xl border-0 bg-white p-2 shadow-2xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-900">
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={onTopUp}
          className="h-11 w-full justify-start gap-2.5 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Top Up</span>
        </Button>

        <Button
          type="button"
          onClick={onTransfer}
          className="h-11 w-full justify-start gap-2.5 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Transfer</span>
        </Button>
      </CardContent>
    </Card>
  );
}
