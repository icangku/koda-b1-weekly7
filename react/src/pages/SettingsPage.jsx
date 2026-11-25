import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export function SettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        username: user.userName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      await apiFetch("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          fullName: profile.fullName,
          phoneNumber: profile.phone,
        }),
      });
      await refreshProfile();
      setProfileSuccess("Profil berhasil diperbarui.");
    } catch (err) {
      setProfileError(err.message || "Gagal memperbarui profil.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      setPasswordSuccess("Kata sandi berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = (user?.fullName || user?.userName || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TopHeader
        eyebrow="Akun Saya"
        title="Pengaturan"
        subtitle="Perbarui informasi pribadi dan keamanan akun."
        userName={user?.fullName || user?.userName || "Pengguna"}
        initials={initials}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="rounded-2xl border-slate-200/70 bg-white py-5 sm:py-7 shadow-2xs lg:col-span-8">
          <CardContent className="px-4 sm:px-7">
            <h2 className="text-base font-bold text-slate-900">
              Informasi profil
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Informasi ini akan tampil di profil akunmu.
            </p>

            {profileSuccess && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-[#0d5c52]">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSubmitProfile} className="mt-6 space-y-5">
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
                  required
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
                  Username (tidak dapat diubah)
                </label>
                <input
                  id="prof-username"
                  type="text"
                  disabled
                  value={profile.username}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-slate-50 px-3.5 text-sm text-slate-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prof-email"
                  className="block text-xs font-medium text-slate-500"
                >
                  Email (tidak dapat diubah)
                </label>
                <input
                  id="prof-email"
                  type="email"
                  disabled
                  value={profile.email}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-slate-50 px-3.5 text-sm text-slate-500 outline-none"
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
                  required
                  value={profile.phone}
                  onChange={handleChange("phone")}
                  className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#0d5c52]"
                />
              </div>

              <Button
                type="submit"
                disabled={profileLoading}
                className="mt-2 h-11 w-full rounded-lg bg-[#0d5c52] text-xs font-semibold text-white hover:bg-[#09473f] disabled:opacity-50"
              >
                {profileLoading ? "Menyimpan..." : "Simpan perubahan"}
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
                onClick={() => {
                  setShowPasswordModal(true);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="mt-5 h-10 w-full rounded-lg bg-[#f2f8f6] px-4 text-xs font-semibold text-[#0d5c52] transition-colors hover:bg-[#e6f2ee]"
              >
                Ubah kata sandi
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Ubah Kata Sandi</h3>
            <p className="mt-1 text-xs text-slate-500">
              Masukkan kata sandi saat ini dan tentukan kata sandi yang baru.
            </p>

            {passwordSuccess && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-[#0d5c52]">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Kata Sandi Saat Ini</label>
                <Input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Kata Sandi Baru</label>
                <Input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="h-10 text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                  className="h-9 text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="h-9 bg-[#0d5c52] text-xs text-white hover:bg-[#09473f]"
                >
                  {passwordLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
