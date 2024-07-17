import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

const PublicRoute: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
//   const { admin } = useSelector((state: RootState) => state.authAdmin);

  // Check for admin first
//   if (admin) {
//     return <Navigate to={"/admin/"} replace />;
//   }

  // Check for user roles
  if(user?.role ==="rider"){
    return <Navigate to={"/user/"} replace /> 
  }else if(user?.role ==="host"){
    return  <Navigate to={"/driver/"} replace />
  }

  return <Outlet />;
};

export default PublicRoute;