import React from 'react'
import AdminLoginForm from '../../components/admin/AdminLoginForm';


const AdminLogin:React.FC = () => {
  
  return (
     <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <AdminLoginForm />
    </div>
  )
}

export default AdminLogin;