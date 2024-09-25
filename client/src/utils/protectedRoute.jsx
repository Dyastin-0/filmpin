import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { token, signingIn } = useAuth();
  const location = useLocation();

  if (location.pathname === "/*") return <Outlet />;

  if (signingIn) return;

  return token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/sign-in"
      state={{ from: `${location.pathname}${location.search} ` }}
    />
  );
};

export default ProtectedRoute;
