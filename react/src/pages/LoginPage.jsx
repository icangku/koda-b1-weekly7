import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage({
  onLoginSuccess,
  onForgotPassword,
  onRegisterClick,
  defaultIdentifier = "nadia@example.com",
}) {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess?.({ identifier, password });
  };

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <section className="flex flex-col justify-between bg-[#0d5c52] px-8 py-10 text-white sm:px-14 sm:py-12 lg:min-h-screen lg:w-[46%]">
        <div>
          <span className="text-base font-bold tracking-tight text-white">
            koda wallet
          </span>
        </div>

        <div className="my-12 max-w-md lg:my-0">
          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
            <span className="block">Uangmu,</span>
            <span className="block">lebih terarah.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-emerald-100/85 sm:text-[15px]">
            Kelola saldo, kirim uang, dan lihat setiap transaksi dalam satu
            tempat.
          </p>
        </div>

        <div className="h-px w-full max-w-md bg-white/25" />
      </section>

      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:min-h-screen">
        <Card className="w-full max-w-md border-0 border- bg-transparent shadow-none">
          <CardContent className="px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Selamat datang kembali
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Masuk untuk melanjutkan ke dompetmu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="block text-xs font-medium text-slate-500"
                >
                  Email atau username
                </label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nama@email.com atau username"
                  className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-500"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm tracking-widest text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-semibold text-[#0d5c52] hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-[#0d5c52] text-sm font-semibold text-white hover:bg-[#09473f]"
              >
                Masuk ke akun
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Belum memiliki akun?{" "}
              <button
                type="button"
                onClick={onRegisterClick}
                className="font-semibold text-[#0d5c52] hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
