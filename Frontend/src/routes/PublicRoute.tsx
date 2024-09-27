import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

const PublicRoute: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if(user?.role ==="rider"){
    return <Navigate to={"/user/"} replace /> 
  }else if(user?.role ==="host"){
    return  <Navigate to={"/driver/"} replace />
  }

  return <Outlet />;
};

export default PublicRoute;