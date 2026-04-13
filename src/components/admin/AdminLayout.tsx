import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ADMIN_LOGIN_PATH } from "../../config/adminRoutes";
import { clearAdminSession } from "../../services/adminAuth";
import { BrandLogo } from "../BrandLogo";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/products/add", label: "Add product" },
  { to: "/admin/offers", label: "Offers" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/analytics", label: "Analytics" },
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-paper text-ink md:flex">
      <aside className="border-b border-black/5 bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-6 md:block">
          <BrandLogo to="/admin/dashboard" />
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink md:mt-8 md:w-full md:border md:border-black/10 md:px-4 md:py-2"
            onClick={() => {
              clearAdminSession();
              navigate(ADMIN_LOGIN_PATH, { replace: true });
            }}
          >
            Logout
          </button>
        </div>
        <nav className="hidden flex-col gap-1 px-3 pb-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-ink text-white" : "text-muted hover:bg-black/[0.04] hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-4 py-4 backdrop-blur md:hidden">
          <p className="text-xs font-semibold uppercase tracking-widest">Menu</p>
        </header>
        <nav className="flex flex-wrap gap-2 border-b border-black/5 bg-white px-3 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                  isActive ? "border-ink bg-ink text-white" : "border-black/10 text-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
