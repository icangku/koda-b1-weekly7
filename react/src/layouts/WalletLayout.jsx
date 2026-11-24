import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";

const PATH_TO_TAB = [
  { path: "/dashboard", tab: "beranda" },
  { path: "/topup", tab: "isi-saldo" },
  { path: "/transfer", tab: "transfer" },
  { path: "/activities", tab: "aktivitas" },
  { path: "/settings", tab: "pengaturan" },
];

const TAB_TO_PATH = {
  beranda: "/dashboard",
  "isi-saldo": "/topup",
  transfer: "/transfer",
  aktivitas: "/activities",
  pengaturan: "/settings",
};

export function WalletLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const currentTab =
    PATH_TO_TAB.find((item) => pathname.startsWith(item.path))?.tab ||
    "beranda";

  const handleSelectTab = (tabId) => {
    const targetPath = TAB_TO_PATH[tabId];
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f9fbfa] text-slate-900">
      <Sidebar
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onLogout={handleLogout}
        onHelpClick={() => console.log("Pusat Bantuan diklik")}
        isAdmin={isAdmin}
        onGoToAdmin={() => navigate("/admin")}
      />

      <main className="flex-1 px-6 py-7 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
