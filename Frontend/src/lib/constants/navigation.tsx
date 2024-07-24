import { HiOutlineUsers, HiOutlineViewGrid, HiOutlineCog } from 'react-icons/hi';
import { FaAddressCard } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

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
        label:"License Review(Driver)",
        path:"/admin/license-review",
        icon:<FaAddressCard />
    },
    {
        key:"document",
        label:"Document Review(User)",
        path:"/admin/document-review",
        icon:<FaAddressCard />
    },{
        key:"vehicles",
        label:"Vehicle Review",
        path:"/admin/vehicles",
        icon:<FaCar />
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

