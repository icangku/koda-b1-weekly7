import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterPage({
  onRegisterSuccess,
  onLoginClick,
  defaultValues = {
    fullName: "Nadia Putri",
    username: "nadia",
    email: "nadia@example.com",
    phone: "0812 3456 7890",
    password: "",
    confirmPassword: "",
  },
}) {
  const [form, setForm] = useState(defaultValues);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterSuccess?.(form);
  };

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel Kiri: Branding */}
      <section className="flex flex-col justify-between bg-[#0d5c52] px-8 py-10 text-white sm:px-14 sm:py-12 lg:min-h-screen lg:w-[36%]">
        <div>
          <span className="text-base font-bold tracking-tight text-white">
            koda wallet
          </span>
        </div>

        <div className="my-12 max-w-sm lg:my-0">
          <h1 className="text-4xl leading-[1.12] font-bold tracking-tight sm:text-[44px]">
            <span className="block">Satu akun,</span>
            <span className="block">satu dompet.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-emerald-100/85">
            Dompet digital akan otomatis dibuat setelah pendaftaran berhasil.
          </p>
        </div>

        <div className="h-4" />
      </section>

      {/* Panel Kanan: Form Buat Akun */}
      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:min-h-screen">
        <Card className="w-full max-w-xl border-0 bg-transparent py-0 shadow-none">
          <CardContent className="px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Buat akun KodaWallet
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Isi data pribadi untuk mulai menggunakan dompet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Baris 1: Nama lengkap & Username */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-medium text-slate-500"
                  >
                    Nama lengkap
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Nama lengkap"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-slate-500"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange("username")}
                    placeholder="username"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>
              </div>

              {/* Baris 2: Email & Nomor telepon */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-500"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="nama@email.com"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-slate-500"
                  >
                    Nomor telepon
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="0812 3456 7890"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>
              </div>

              {/* Baris 3: Password & Konfirmasi password */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Minimal 8 karakter"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-slate-500"
                  >
                    Konfirmasi password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="Ulangi password"
                    className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                  />
                </div>
              </div>

              {/* Info Saldo Awal */}
              <p className="pt-1 text-xs text-slate-400">
                Akun baru akan mendapatkan dompet aktif dengan saldo Rp0.
              </p>

              {/* Tombol Submit */}
              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-[#0d5c52] text-sm font-semibold text-white hover:bg-[#09473f]"
              >
                Buat akun
              </Button>
            </form>

            {/* Footer Link */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Sudah terdaftar?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="font-semibold text-[#0d5c52] hover:underline"
              >
                Masuk
              </button>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
