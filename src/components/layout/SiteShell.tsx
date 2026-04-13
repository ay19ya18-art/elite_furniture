import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CopyrightWatermark } from "../CopyrightWatermark";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { trackPageView } from "../../services/analyticsService";

export function SiteShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return (
    <div className="relative min-h-dvh flex flex-col bg-white">
      <CopyrightWatermark />
      <SiteHeader />
      <main id="main-content" className="relative flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
