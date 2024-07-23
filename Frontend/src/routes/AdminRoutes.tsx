import { Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/admin/AdminLogin"
import Layout from "../pages/admin/Layout"
import Dashboard from "../pages/admin/Dashboard"
import UserList from "../components/admin/rider/UserList"
import LicenseApprovalTable from "../pages/admin/LicenseApproval"
import DocumentApprovalPage from "../pages/admin/DocumentApprovalPage"

export default function AdminRoutes(){
    return(
      <Routes>
        <Route path='/login' element={<AdminLogin />} />
        <Route path='/' element={<Layout/>}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/license-review/:userId?' element={<LicenseApprovalTable />}/>
            <Route path='/document-review' element={<DocumentApprovalPage />} />
        </Route>
      </Routes>
    )
}