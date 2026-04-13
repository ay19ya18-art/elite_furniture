import { Navigate, useLocation } from "react-router-dom";
import { ADMIN_LOGIN_PATH } from "../../config/adminRoutes";
import { isAdminAuthenticated } from "../../services/adminAuth";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAdminAuthenticated()) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
