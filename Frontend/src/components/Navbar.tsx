import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoIosSettings, IoIosHelpCircle, IoIosLogOut } from "react-icons/io";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ModeToggle } from "../components/mode-toggle";
import CarIcon from "../components/CarIcon";
import { removeCookie } from "../functions/CalculateTime";
import { useEssentials } from "../hooks/UseEssentials";
import { resetState } from "../redux/userStore/Authentication/AuthSlice";
import DriverNotification from "./driver/DriverNotification";
import UserNotification from "./user/UserNotification";
import { FaCar } from "react-icons/fa";

const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { dispatch, navigate, auth } = useEssentials();
  const user = auth.user;
    const role = auth.user?.role;
  const logout = () => {
    removeCookie("token");
    removeCookie("refreshToken");
    dispatch(resetState());
    navigate("/user/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <CarIcon />
          <span>CarPool</span>
        </Link>
        <div className="flex items-center gap-4">
          {role==="rider"&&
           <UserNotification />
          }
          {role === "host" &&
           <DriverNotification />
          }
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border w-8 h-8"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{user?.name?.slice(0,2).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
          </Button>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>
                  Additional options for your CarPool account.
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-4 p-4">
                {role && role === "host" &&
                <Link
                to="/driver/driver-profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <FiUser />
                <span>Profile</span>
              </Link>
                }
                {role && role === "rider" &&
                <Link
                to="/user/user-profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <FiUser />
                <span>Profile</span>
              </Link>
                }
                
               {role=== "rider"&&
                <Link
                to="/user/myrides"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <FaCar />
                <span>My Rides</span>
              </Link>
               }
               {role=== "host"&&
                <Link
                to="/driver/myrides"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <FaCar />
                <span>My Rides</span>
              </Link>
               }
                <Link
                  to="/help"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                  <IoIosHelpCircle />
                  <span>Help</span>
                </Link>
                <a
                  onClick={logout}
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                  <IoIosLogOut />
                  <span>Logout</span>
                </a>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <div />
        </div>
      </div>
    </header>
  );
};

export default Header;
