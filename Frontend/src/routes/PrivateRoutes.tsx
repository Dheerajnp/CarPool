import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useEssentials } from "../hooks/UseEssentials";
import { resetState } from "../redux/userStore/Authentication/AuthSlice";

export const clearState = (token: string) => {
  const { dispatch } = useEssentials();
  useEffect(() => {
    if (!token) {
      dispatch(resetState());
    }
  }, []);
};

export const UserPrivateRoute: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const token = Cookies.get("token");
  clearState(token as string);
  return token && user?.role === "rider" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export const DriverPrivateRoute: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const token = Cookies.get("token");
  clearState(token as string);
  return user?.role === "host" ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminPrivateRoute: React.FC = () => {
  const { admin } = useSelector((state: RootState) => state.authAdmin);
  const adminToken = Cookies.get("adminToken");
  clearState(adminToken as string);
  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
};
