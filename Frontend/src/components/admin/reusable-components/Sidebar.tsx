import React from 'react'
import { FaCarOn } from "react-icons/fa6";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../../lib/constants/navigation';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { HiOutlineLogout } from 'react-icons/hi';

const linkClassess = 'flex items-center gap-2 px-3 py-2 rounded-sm text-base hover:no-underline hover:bg-neutral-700 hover:text-white  font-light active:bg-neutral-400';
interface SidebarLink {
    key:string,
    label: string;
    path: string;
    icon:JSX.Element
  }
const Sidebar = () => {

  
  return (
    <div className='bg-white w-60 p-3 flex flex-col text-black '>
        <div className='flex items-center px-1 py-2 gap-2 justify-center'>
            <FaCarOn fontSize={22} />
            <span className='text-black font-bold  text-lg pt-1'>CarPool</span>
        </div>
        <div className='flex-1 flex flex-col py-8 gap-0.5'>
            {DASHBOARD_SIDEBAR_LINKS.map((item:SidebarLink,index:number)=>{
                return <SideBarLinks key={index} item={item}/>
            })}
        </div>
        <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
          {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item:SidebarLink,index:number)=>{
            return <SideBarLinks key={index} item={item} />
          })}
          <div className={classNames('text-red-500 cursor-pointer',linkClassess)}>
            <span className='text-xl'>
              <HiOutlineLogout />
            </span>
            Logout
          </div>
        </div>
    </div>
  )
}

interface SideBarLinksProps {
    item: SidebarLink;
  } 

const SideBarLinks : React.FC<SideBarLinksProps> = ({ item })=>{
  const { pathname } = useLocation();

  // Check if the current pathname starts with the item path for dynamic paths
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

  return (
    <Link to={item.path} className={classNames(isActive ? 'text-white font-bold bg-indigo-500' : 'text-black', linkClassess)}>
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
  }

export default Sidebar