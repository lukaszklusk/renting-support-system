import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ roles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles?.find((role) => roles?.includes(role)) ? (
    <Outlet />
  ) : auth?.isLoggedIn ? (
    <Navigate to="unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
