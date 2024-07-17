
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/reusable-components/Sidebar'
import Header from '../../components/admin/reusable-components/Header'

const Layout = () => {
  return (
    
    <div className="flex flex-row h-screen w-screen bg-neutral-50 overflow-hidden">
        <Sidebar/>
    <div className="flex-1">
        <Header/>
    <div className="p-4">{<Outlet />}</div>
    </div>
  </div>
  )
}

export default Layout