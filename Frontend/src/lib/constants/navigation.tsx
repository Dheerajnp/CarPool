import { HiOutlineUsers, HiOutlineViewGrid, HiOutlineCog } from 'react-icons/hi';
import { FaAddressCard } from "react-icons/fa";

export const DASHBOARD_SIDEBAR_LINKS =[
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/admin/",
        icon: <HiOutlineViewGrid />
    },
    {
        key: "users",
        label: "Users",
        path: "/admin/users",
        icon: <HiOutlineUsers />
    },
    {
        key:"license",
        label:"License Review",
        path:"/admin/license-review",
        icon:<FaAddressCard />
    }
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS =[
    {
        key: "settings",
        label: "Settings",
        path: "/admin/settings",
        icon: <HiOutlineCog />
    }

]

