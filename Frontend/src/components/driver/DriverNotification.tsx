import { HiOutlineBell } from "react-icons/hi";
import {
  Popover,
  PopoverButton,
  Transition,
  PopoverPanel,
} from "@headlessui/react";

import classNames from "classnames";
import useSocket from "../../hooks/UseSocket";
import { useEffect, useState } from "react";
import { useEssentials } from "../../hooks/UseEssentials";
import axiosApiGateway from "../../functions/axios";

interface Notification {
  _id: string;
  message: string;
  sender: string; // You can replace this with sender's name or ID if needed
  status: "unread" | "read";
  createdAt: Date;
  senderName: string; // Sender's name
  rideId:string; //ride
}

const DriverNotification = () => {
  const { auth,navigate } = useEssentials();
  const socket = useSocket(auth.user?.id as string);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
          const response = await axiosApiGateway.get(`/driver/notifications`, {
            params: { userId: auth.user?.id },
          });
          console.log("notification data",response.data.notifications)
          setNotifications(response.data.notifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
  
      fetchNotifications();

    if (socket) {
      socket.on("notification", (newNotification: Notification,name:string) => {
        setNotifications((prevNotifications) => [
          {...newNotification,sender:name},
          ...prevNotifications,
        ]);
      });
    }
    () => {
      socket?.disconnect()
    };
  }, [socket]);  

  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton
            className={classNames(
              open && "bg-gray-100 text-black",
              "p-1.5 sm-rounded inline-flex items-center gap-2 text-gray-600 hover:text-black focus:outline-none active:bg-gray-100"
            )}
          >
            <HiOutlineBell fontSize={24} />
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute right-0 mt-2.5 z-10 w-80">
              <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                <strong className="text-gray-700 font-medium">
                  Notifications
                </strong>
                <div className="mt-2 py-1 text-sm gap-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={()=>navigate(`/driver/rideDetails/${notification?.rideId}`)}
                        className={`p-2 rounded-md mt-1 cursor-pointer ${
                          notification.status === "unread" ? "bg-blue-100" : ""
                        }`}
                      >
                        {notification.message} FROM {notification.senderName}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No new notifications</div>
                  )}
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default DriverNotification;
