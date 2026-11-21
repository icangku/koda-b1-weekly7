import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { WalletLayout } from "@/layouts/WalletLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { TopUpPage } from "@/pages/TopUpPage";
import { TransferPage } from "@/pages/TransferPage";
import { ActivitiesPage } from "@/pages/ActivitiesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminUserDetailPage } from "@/pages/admin/AdminUserDetailPage";
import "./App.css";
import { AdminLayout } from "./layouts/AdminLayout";
const WALLET_SUMMARY = {
  userName: "Nadia",
  fullName: "Nadia Putri",
  initials: "NP",
  balance: 1250000,
  balanceFormatted: "Rp 1.250.000",
  walletNumber: "KW •••• 1842",
  status: "Aktif",
};

const SAMPLE_ACTIVITIES = [
  {
    id: "1",
    title: "Top up melalui QRIS",
    timestamp: "17 Nov 2026 · 09.34",
    refCode: "TRX-20261117-1051",
    category: "Pemasukan",
    type: "TOP UP",
    amountFormatted: "+ Rp250.000",
    amount: "+ Rp250.000",
    status: "Berhasil",
  },
  {
    id: "2",
    title: "Transfer ke Bima Pratama",
    timestamp: "16 Nov 2026 · 14.20",
    refCode: "TRX-20261116-1037",
    category: "Pengeluaran",
    type: "TRANSFER",
    amountFormatted: "- Rp75.000",
    amount: "- Rp75.000",
    status: "Berhasil",
  },
  {
    id: "3",
    title: "Transfer dari Rina",
    timestamp: "15 Nov 2026 · 12.08",
    refCode: "TRX-20261115-1004",
    category: "Pemasukan",
    type: "TRANSFER",
    amountFormatted: "+ Rp120.000",
    amount: "+ Rp120.000",
    status: "Berhasil",
  },
];

function LoginRouteWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLoginSuccess={() => navigate("/dashboard")}
      onForgotPassword={() => console.log("Lupa kata sandi")}
      onRegisterClick={() => navigate("/register")}
    />
  );
}

function RegisterRouteWrapper() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onRegisterSuccess={() => navigate("/dashboard")}
      onLoginClick={() => navigate("/login")}
    />
  );
}

function DashboardRouteWrapper() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <DashboardPage
        activeTab="beranda"
        onSelectTab={(tab) => {
          if (tab === "isi-saldo") navigate("/topup");
          if (tab === "transfer") navigate("/transfer");
          if (tab === "aktivitas") navigate("/activities");
          if (tab === "pengaturan") navigate("/settings");
        }}
        walletSummary={WALLET_SUMMARY}
        activities={SAMPLE_ACTIVITIES}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect default ke /dashboard (atau ubah ke /login jika ingin mulai dari login) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginRouteWrapper />} />
        <Route path="/register" element={<RegisterRouteWrapper />} />

        {/* User Wallet Routes (dengan Sidebar) */}
        <Route element={<WalletLayout />}>
          <Route path="/dashboard" element={<DashboardRouteWrapper />} />
          <Route
            path="/topup"
            element={
              <TopUpPage
                userName={WALLET_SUMMARY.userName}
                fullName={WALLET_SUMMARY.fullName}
                initials={WALLET_SUMMARY.initials}
                currentBalance={WALLET_SUMMARY.balance}
              />
            }
          />
          <Route
            path="/transfer"
            element={
              <TransferPage
                userName={WALLET_SUMMARY.userName}
                initials={WALLET_SUMMARY.initials}
                currentBalance={WALLET_SUMMARY.balance}
              />
            }
          />
          <Route
            path="/activities"
            element={
              <ActivitiesPage
                userName={WALLET_SUMMARY.userName}
                initials={WALLET_SUMMARY.initials}
                transactions={SAMPLE_ACTIVITIES}
                totalCount={24}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                userName={WALLET_SUMMARY.userName}
                initials={WALLET_SUMMARY.initials}
                onSaveProfile={(data) => console.log("Simpan profil:", data)}
                onChangePassword={() => console.log("Ubah kata sandi")}
              />
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewRouteWrapper />} />
          <Route path="users" element={<AdminUsersRouteWrapper />} />
          <Route path="users/:id" element={<AdminUserDetailRouteWrapper />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminOverviewRouteWrapper() {
  const navigate = useNavigate();
  return <AdminOverviewPage onViewAllUsers={() => navigate("/admin/users")} />;
}

function AdminUsersRouteWrapper() {
  const navigate = useNavigate();
  return (
    <AdminUsersPage
      onSelectUser={(user) =>
        navigate(`/admin/users/${user.id}`, { state: { user } })
      }
    />
  );
}

function AdminUserDetailRouteWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <AdminUserDetailPage
      userId={id}
      onBackToList={() => navigate("/admin/users")}
    />
  );
}
