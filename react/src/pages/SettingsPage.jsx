import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/dashboard/TopHeader";

export function SettingsPage({
  userName = "Nadia",
  initials = "NP",
  onSaveProfile,
  onChangePassword,
}) {
  const [profile, setProfile] = useState({
    fullName: "Nadia Putri",
    username: "nadia",
    email: "nadia@example.com",
    phone: "0812 3456 7890",
  });

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile?.(profile);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Akun Saya"
        title="Pengaturan"
        subtitle="Perbarui informasi pribadi dan keamanan akun."
        userName={userName}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-7">
            <h2 className="text-base font-bold text-slate-900">
              Informasi profil
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Informasi ini akan tampil di profil akunmu.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="prof-fullname"
                  className="block text-xs font-medium text-slate-500"
                >
                  Nama lengkap
                </label>
                <input
                  id="prof-fullname"
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange("fullName")}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prof-username"
                  className="block text-xs font-medium text-slate-500"
                >
                  Username
                </label>
                <input
                  id="prof-username"
                  type="text"
                  value={profile.username}
                  onChange={handleChange("username")}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prof-email"
                  className="block text-xs font-medium text-slate-500"
                >
                  Email
                </label>
                <input
                  id="prof-email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange("email")}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prof-phone"
                  className="block text-xs font-medium text-slate-500"
                >
                  Nomor ponsel
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange("phone")}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f]"
              >
                Simpan perubahan
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/70 bg-white py-6 shadow-2xs">
            <CardContent className="px-6">
              <h2 className="text-base font-bold text-slate-900">
                Keamanan akun
              </h2>

              <p className="mt-5 text-xs font-semibold text-slate-800">
                Kata sandi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Ubah secara berkala untuk menjaga keamanan akunmu.
              </p>

              <button
                type="button"
                onClick={onChangePassword}
                className="mt-5 h-10 w-full rounded-lg bg-[#f2f8f6] px-4 text-xs font-semibold text-[#0d5c52] transition-colors hover:bg-[#e6f2ee]"
              >
                Ubah kata sandi
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
