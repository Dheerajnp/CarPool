// import React from 'react'
import { Fragment } from "react";
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from 'react-icons/hi'
import {
  Popover,
  PopoverButton,
  Transition,
  PopoverPanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom';
import { removeCookie } from "../../../functions/CalculateTime";
import { useEssentials } from "../../../hooks/UseEssentials";
import { resetAdminState } from "../../../redux/adminStore/Authentication/AdminAuthSlice";

const Header = () => {
  const { dispatch } = useEssentials();
  const logout = () => {
    removeCookie('adminToken');
    removeCookie('adminRefreshToken')
    dispatch(resetAdminState())
    navigate('/admin/login')
  }

  const navigate = useNavigate();
  return (
    <div className='bg-white px-4 h-16 flex justify-between items-center border-b border-gray-100'>
      <div className='relative'>
        <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3' />
        <input type="text" placeholder='Search...' className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-200 rounded-sm pl-11 pr-4'/>
      </div>
      <div className='flex items-center gap-2 mr-7'>
      <Popover>
      {({ open }) => (
        <>
          <PopoverButton className={classNames(open && 'bg-gray-100 text-black'," p-1.5 sm-rounded inline-flex items-center gap-2 text-gray-600 hover:text-black focus:outline-none active:bg-gray-100")}>
          <HiOutlineChatAlt fontSize={24} />
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >

          <PopoverPanel className='absolute right-0 mt-2.5 z-10 w-80'>
             <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                <strong className='text-gray-700 font-medium'>Messages</strong>
                <div className='mt-2 py-1 text-sm'>
                    This is the messages panel
                </div>
             </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>

    <Popover>
      {({ open }) => (
        <>
          <PopoverButton className={classNames(open && 'bg-gray-100 text-black'," p-1.5 sm-rounded inline-flex items-center gap-2 text-gray-600 hover:text-black focus:outline-none active:bg-gray-100")}>
          <HiOutlineBell fontSize={24}/>
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >

          <PopoverPanel className='absolute right-0 mt-2.5 z-10 w-80'>
             <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                <strong className='text-gray-700 font-medium'>Notifications</strong>
                <div className='mt-2 py-1 text-sm'>
                    This is the notifications panel
                </div>
             </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
    <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div
              className="h-8 w-8 rounded-full bg-white bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Isolated-HD.png")',
              }}
            ></div>
          </MenuButton>
          <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          >
             <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <MenuItem>
                {({ active }) => (
                  <div
                    // onClick={() => navigate("/admin/settings")}
                    className={classNames(
                        active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2 "
                    )}
                  >
                    Settings
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => logout()}
                    className={classNames(
                        active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2"
                    )}
                  >
                    Sign out
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
      </Menu>
        
        
      </div>
    </div>
  )
}

export default Header