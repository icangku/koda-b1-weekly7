import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, User, Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

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

const ADMIN_BOTTOM_ITEMS = [
  { id: "ringkasan", label: "Ringkasan", icon: LayoutGrid },
  { id: "pengguna", label: "Pengguna", icon: Users },
  { id: "profil", label: "Profil", icon: User },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentTab =
    PATH_TO_TAB.find((item) => pathname.startsWith(item.path))?.tab ||
    "ringkasan";

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

  const initials = (user?.fullName || user?.userName || "AD")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fbfa] text-slate-900 md:flex-row">
      {/* Desktop Sidebar (hidden on mobile) */}
      <AdminSidebar
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onLogout={handleLogout}
        onHelpClick={() => console.log("Pusat Bantuan diklik")}
        className="hidden md:flex min-h-screen sticky top-0 h-screen"
      />

      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
          aria-label="Buka menu admin"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0d5c52] text-xs font-bold text-white">
            k
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            koda <span className="font-semibold text-[#0d5c52]">wallet</span>
          </span>
          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/profile")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d5c52] text-[11px] font-bold text-white shadow-2xs"
            title={user?.fullName || user?.userName || "Admin"}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out">
            <AdminSidebar
              activeTab={currentTab}
              onSelectTab={handleSelectTab}
              onLogout={handleLogout}
              onHelpClick={() => console.log("Pusat Bantuan diklik")}
              onClose={() => setIsMobileMenuOpen(false)}
              className="flex w-full h-full border-r-0"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 pb-24 md:pb-7 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.03)] md:hidden">
        {ADMIN_BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors",
                isActive
                  ? "font-semibold text-[#0d5c52]"
                  : "font-medium text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[#0d5c52]" : "text-slate-400")} />
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
