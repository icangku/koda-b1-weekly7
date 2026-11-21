import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const PATH_TO_TAB = [
  { path: "/admin/users", tab: "pengguna" },
  { path: "/admin/profile", tab: "profil" },
  { path: "/admin", tab: "ringkasan" },
];

const TAB_TO_PATH = {
  ringkasan: "/admin",
  pengguna: "/admin/users",
  profil: "/admin/profile",
};

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTab =
    PATH_TO_TAB.find((item) => pathname.startsWith(item.path))?.tab ||
    "ringkasan";

  const handleSelectTab = (tabId) => {
    const targetPath = TAB_TO_PATH[tabId];
    if (targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f9fbfa] text-slate-900">
      <AdminSidebar
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onLogout={() => navigate("/login")}
        onHelpClick={() => console.log("Pusat Bantuan diklik")}
      />

      <main className="flex-1 px-6 py-7 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
