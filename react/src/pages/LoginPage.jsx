import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export function LoginPage({
  onLoginSuccess,
  onForgotPassword,
  onRegisterClick,
  defaultIdentifier = "",
}) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot / Reset Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState("request"); // "request" | "reset"
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(identifier, password);
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalMessage("");
    setModalLoading(true);
    try {
      const res = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setModalMessage(res.message || "Kode/token reset berhasil dibuat.");
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setForgotStep("reset");
    } catch (err) {
      setModalError(err.message || "Gagal mengirim permintaan reset password.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalMessage("");
    setModalLoading(true);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: forgotEmail,
          token: resetToken,
          newPassword,
        }),
      });
      setModalMessage("Password berhasil diubah. Silakan masuk dengan password baru.");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep("request");
        setModalMessage("");
        setModalError("");
      }, 2000);
    } catch (err) {
      setModalError(err.message || "Gagal mengatur ulang password.");
    } finally {
      setModalLoading(false);
    }
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
            Kelola saldo, kirim uang, dan lihat setiap transaksi dalam satu tempat.
          </p>
        </div>

        <div className="h-px w-full max-w-md bg-white/25" />
      </section>

      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:min-h-screen">
        <Card className="w-full max-w-md border-0 bg-transparent shadow-none ring-0">
          <CardContent className="px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Selamat datang kembali
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Masuk untuk melanjutkan ke dompetmu.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {error}
              </div>
            )}

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
                  required
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-none focus-visible:border-[#0d5c52] focus-visible:ring-[#0d5c52]/20"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onForgotPassword) onForgotPassword();
                      setShowForgotModal(true);
                      setForgotStep("request");
                      setModalError("");
                      setModalMessage("");
                    }}
                    className="text-xs font-semibold text-[#0d5c52] hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-[#0d5c52] text-sm font-semibold text-white hover:bg-[#09473f] disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk ke akun"}
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

      {/* Modal Lupa / Reset Password */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              {forgotStep === "request" ? "Lupa Kata Sandi" : "Atur Ulang Kata Sandi"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {forgotStep === "request"
                ? "Masukkan email akunmu untuk menerima token reset password."
                : "Masukkan token yang didapatkan dan tentukan password baru."}
            </p>

            {modalError && (
              <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
                {modalError}
              </div>
            )}
            {modalMessage && (
              <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-[#0d5c52]">
                {modalMessage}
              </div>
            )}

            {forgotStep === "request" ? (
              <form onSubmit={handleRequestReset} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Email</label>
                  <Input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotModal(false)}
                    className="h-9 text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={modalLoading}
                    className="h-9 bg-[#0d5c52] text-xs text-white hover:bg-[#09473f]"
                  >
                    {modalLoading ? "Memproses..." : "Kirim Permintaan"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Token Reset</label>
                  <Input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Masukkan token reset"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Password Baru</label>
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
                    onClick={() => setShowForgotModal(false)}
                    className="h-9 text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={modalLoading}
                    className="h-9 bg-[#0d5c52] text-xs text-white hover:bg-[#09473f]"
                  >
                    {modalLoading ? "Memproses..." : "Ubah Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
