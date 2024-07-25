import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Layout from "../pages/admin/Layout";
import RoundLoader from "../components/RoundLoader";

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const UserList = lazy(() => import("../components/admin/rider/UserList"));
const LicenseApprovalTable = lazy(() => import("../pages/admin/LicenseApproval"));
const DocumentApprovalPage = lazy(() => import("../pages/admin/DocumentApprovalPage"));
const VehicleReviewListPage = lazy(() => import("../components/admin/rider/VehicleReviewList"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/' element={<Layout />}>
        <Route path='/' element={
          <Suspense fallback={<div className="flex justify-center items-center mx-auto my-auto"><RoundLoader/></div>}>
            <Dashboard />
          </Suspense>
        } />
        <Route path='/users' element={
          <Suspense fallback={<div className="flex justify-center items-center mx-auto my-auto"><RoundLoader/></div>}>
            <UserList />
          </Suspense>
        } />
        <Route path='/license-review/:userId?' element={
          <Suspense fallback={<div className="flex justify-center items-center mx-auto my-auto"><RoundLoader/></div>}>
            <LicenseApprovalTable />
          </Suspense>
        } />
        <Route path='/document-review' element={
          <Suspense fallback={<div className="flex justify-center items-center mx-auto my-auto"><RoundLoader/></div>}>
            <DocumentApprovalPage />
          </Suspense>
        } />
        <Route path='/vehicles' element={
          <Suspense fallback={<div className="flex justify-center items-center mx-auto my-auto"><RoundLoader/></div>}>
            <VehicleReviewListPage />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
