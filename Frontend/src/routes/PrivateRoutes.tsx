import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const UserPrivateRoute:React.FC = () =>{
const { user } = useSelector((state:RootState)=> state.auth)
return user?.role ==="rider"?<Outlet />:<Navigate to="/login" />
}


export const DriverPrivateRoute:React.FC = ()=>{
    const { user } =useSelector((state:RootState)=> state.auth)
    return user?.role==="host" ? <Outlet /> : <Navigate to="/login" />
}

export const AdminPrivateRoute:React.FC = ()=>{
    const { admin } = useSelector((state:RootState)=> state.authAdmin)
    return admin ? <Outlet /> : <Navigate to="/admin/login" />
}