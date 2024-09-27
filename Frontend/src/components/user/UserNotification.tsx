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
import { Car } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  sender: string;
  status: "unread" | "read";
  createdAt: Date;
  senderName: string;
  rideId: string;
}

const UserNotification = () => {
  const { auth, navigate } = useEssentials();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  let userId = auth.user?._id ? auth.user?._id : auth.user?.id

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosApiGateway.get(`/user/notifications`, {
          params: { userId: userId },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    if (socket) {
      socket.on("requestnotification", (newNotification: Notification) => {
        setNotifications((prevNotifications) => [
          { ...newNotification },
          ...prevNotifications,
        ]);
      });
    }

    socket?.on("changeNotification", (newNotification: Notification) => {
      console.log(newNotification)
      setNotifications((prevNotifications) => [
        { ...newNotification, status: "read" },
        ...prevNotifications,
      ]);
      navigate(
        `/user/rideDetails/${newNotification?.rideId}`
      );
    });

    return () => {
      // socket?.disconnect();
    };
  }, [socket, userId]);

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
            <PopoverPanel className="absolute right-0 mt-2.5 z-100 w-80">
              <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                <strong className="text-gray-700 font-medium">
                  Notifications
                </strong>
                <div className="mt-2 py-1 text-sm gap-1">
                  {notifications.length > 0 ? (
                    notifications.filter(
                      (notification) => notification.status !== "read"
                    ).length > 0 ? ( // Filter out seen notifications
                      notifications
                        .filter(
                          (notification) => notification.status !== "read"
                        )
                        .map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => {
                              socket?.emit(
                                "notificationSeen",
                                notification._id
                              );
                            }}
                            className={`flex items-start gap-4 p-4 rounded-md mt-1 cursor-pointer relative ${
                              notification.status === "unread"
                                ? "bg-blue-100"
                                : "bg-white"
                            }`}
                          >
                            <div
                              className={`absolute right-2 top-2 h-3 w-3 rounded-full ${
                                notification.status === "read"
                                  ? "bg-transparent"
                                  : "bg-red-500"
                              }`}
                            />
                            <Car className="mt-1 h-10 w-10 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-gray-500">No new notifications</div>
                    )
                  ) : (
                    <div className="text-gray-500">No notifications found</div>
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

export default UserNotification;
