import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletLayout } from "@/layouts/WalletLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
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
import { AdminProfilePage } from "@/pages/admin/AdminProfilePage";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import "./App.css";

function LoginRouteWrapper() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <LoginPage
      onLoginSuccess={(loggedUser) => {
        if (loggedUser?.roles?.includes("ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }}
      onRegisterClick={() => navigate("/register")}
    />
  );
}

function RegisterRouteWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
    <DashboardPage
      onSelectTab={(tab) => {
        if (tab === "isi-saldo") navigate("/topup");
        if (tab === "transfer") navigate("/transfer");
        if (tab === "aktivitas") navigate("/activities");
        if (tab === "pengaturan") navigate("/settings");
      }}
    />
  );
}

function TopUpRouteWrapper() {
  const navigate = useNavigate();
  return (
    <TopUpPage
      onGoToActivities={() => navigate("/activities")}
      onGoToDashboard={() => navigate("/dashboard")}
    />
  );
}

function TransferRouteWrapper() {
  const navigate = useNavigate();
  return (
    <TransferPage
      onGoToActivities={() => navigate("/activities")}
      onGoToDashboard={() => navigate("/dashboard")}
    />
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
      onSelectUser={(user) => navigate(`/admin/users/${user.id}`)}
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Auth Routes */}
          <Route path="/login" element={<LoginRouteWrapper />} />
          <Route path="/register" element={<RegisterRouteWrapper />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* User Wallet Routes (Protected) */}
          <Route element={<ProtectedRoute requireAdmin={false} />}>
            <Route element={<WalletLayout />}>
              <Route path="/dashboard" element={<DashboardRouteWrapper />} />
              <Route path="/topup" element={<TopUpRouteWrapper />} />
              <Route path="/transfer" element={<TransferRouteWrapper />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin Routes (Protected, requireAdmin) */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewRouteWrapper />} />
              <Route path="users" element={<AdminUsersRouteWrapper />} />
              <Route path="users/:id" element={<AdminUserDetailRouteWrapper />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          {/* Default and Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
