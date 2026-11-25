import { ArrowLeft, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TransactionStatusView({
  mode = "confirm", // "confirm" | "qris" | "success"
  backLabel,
  onBack,
  title,
  subtitle,
  rows = [],
  highlightRow,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  referenceNumber,
  currentBalanceText,
}) {
  return (
    <div className="min-h-screen bg-[#f9fbfa] px-4 py-5 sm:px-6 sm:py-7 text-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* Top Brand */}
        <div className="mb-6 sm:mb-10">
          <span className="text-base font-bold tracking-tight text-slate-900">
            koda <span className="font-semibold text-[#0d5c52]">wallet</span>
          </span>
        </div>

        <div className="mx-auto max-w-md">
          {backLabel && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d5c52] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{backLabel}</span>
            </button>
          )}

          <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-7 shadow-2xs">
            <CardContent className="px-4 sm:px-7">
              {mode === "success" ? (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6f4] text-[#0d5c52]">
                    <Check className="h-7 w-7 stroke-[2.5]" />
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {title}
                  </h1>
                  <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>

                  {referenceNumber && (
                    <p className="mt-5 text-[11px] text-slate-400">
                      No. referensi{" "}
                      <span className="font-medium text-slate-500">
                        {referenceNumber}
                      </span>
                    </p>
                  )}

                  {currentBalanceText && (
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Saldo sekarang{" "}
                      <span className="font-semibold text-slate-700">
                        {currentBalanceText}
                      </span>
                    </p>
                  )}

                  <div className="mt-7 w-full space-y-3">
                    {primaryActionLabel && (
                      <Button
                        type="button"
                        onClick={onPrimaryAction}
                        className="h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f]"
                      >
                        {primaryActionLabel}
                      </Button>
                    )}

                    {secondaryActionLabel && (
                      <button
                        type="button"
                        onClick={onSecondaryAction}
                        className="w-full py-1.5 text-xs font-semibold text-[#0d5c52] hover:underline"
                      >
                        {secondaryActionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {title}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

                  {mode === "qris" && (
                    <div className="my-6 flex flex-col items-center">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        {/* QR Code Placeholder Grid */}
                        <div className="grid h-36 w-36 grid-cols-7 gap-1 bg-white p-1">
                          {Array.from({ length: 49 }).map((_, idx) => {
                            const isCorner =
                              (idx < 24 && idx % 7 < 3) ||
                              (idx < 24 && idx % 7 > 3) ||
                              (idx > 24 && idx % 7 < 3);
                            const dark = isCorner || (idx * 7 + 3) % 5 === 0;
                            return (
                              <div
                                key={idx}
                                className={
                                  dark ? "bg-slate-900" : "bg-transparent"
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                      <p className="mt-2.5 text-[11px] text-slate-400">
                        Kode demo, bukan untuk pembayaran nyata.
                      </p>
                    </div>
                  )}

                  <div
                    className={
                      mode === "qris"
                        ? "space-y-3 border-t border-slate-100 pt-4"
                        : "mt-6 space-y-3.5"
                    }
                  >
                    {rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 text-xs"
                      >
                        <span className="text-slate-400">{row.label}</span>
                        <span className="font-semibold text-slate-800">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {highlightRow && (
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">
                        {highlightRow.label}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {highlightRow.value}
                      </span>
                    </div>
                  )}

                  {primaryActionLabel && (
                    <Button
                      type="button"
                      onClick={onPrimaryAction}
                      className="mt-6 h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f]"
                    >
                      {primaryActionLabel}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
