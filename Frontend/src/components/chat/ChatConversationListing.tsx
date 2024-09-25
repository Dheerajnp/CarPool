import { SetStateAction, useEffect } from "react";
import { useEssentials } from "../../hooks/UseEssentials";
import useSocket from "../../hooks/UseSocket";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

interface IConversation {
  _id: string;
  seen: boolean;
  roomId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profile: string;
  };
  driver: {
    _id: string;
    name: string;
    email: string;
    profile: string;
  };
  lastMessage: string;
}

// interface onlineUserFindType {
//   userId: string;
// }

interface ConversationListProps {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  setSelectedConversation: (conversation: IConversation) => void;
  onlineUser: any[];
  counts: { _id: string; unreadCount: number }[];
  setCount: React.Dispatch<
    SetStateAction<{ _id: string; unreadCount: number }[]>
  >;
  // selectedIsOnline:()=>void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  onlineUser,
  counts,
  setCount,
  // selectedIsOnline
}) => {
  const isUserOnline = (userId: string) => {
    return onlineUser.some((user) => user.userId === userId);
  };

  const { auth } = useEssentials();
  const socket = useSocket();

  
  useEffect(() => {
    if (socket && conversations.length > 0 && auth.user) {
      socket.emit(
        "unseenMessage",
        conversations.map((conversation) => conversation.roomId),
        auth.user.id
      );
    }
  }, [socket, auth.user, conversations]);

  useEffect(() => {
    if (socket && selectedConversation) {
      socket.emit("seenMessage", selectedConversation.roomId, auth.user?.id);
      setCount(
        [...counts].filter((count) => count._id !== selectedConversation.roomId)
      );
    }
  }, [socket, selectedConversation]);
  useEffect(() => {
    if (socket) {
      socket.on(
        "UnseenCount",
        (data: { _id: string; unreadCount: number }[]) => {
          setCount([...data]);
        }
      );
    }
    return () => {
      socket?.off("UnseenCount");
    };
  }, [socket]);

  return (
    <ScrollArea className="bg-background rounded-s-lg w-1/4 border p-6 mt-20 flex flex-col gap-4 h-[calc(98vh-80px)]">
      {conversations.map((conversation: IConversation) => {
        const displayUser =
          auth.user?.role === "rider" ? conversation.driver : conversation.user;

        const isOnline = isUserOnline(displayUser._id);

        return (
          <div
            key={conversation._id}
            className={`flex items-center gap-3 p-3 cursor-pointer relative ${
              selectedConversation?._id === conversation._id ? "bg-muted" : ""
            }`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border rounded-full shadow-md ">
                <AvatarImage src={displayUser.profile} alt="Avatar" />
                <AvatarFallback>
                  {displayUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full z-10 ${
                  isOnline ? "bg-green-500" : ""
                }`}
              />
            </div>

            <div className="flex-1">
              <div className="font-medium flex justify-between items-center">
                <span>{displayUser.name}</span>
                <span className="text-xs text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {conversation.lastMessage}
              </div>
            </div>
            {/* Unread message indicator */}
            <div
              className={`absolute right-2 top-2 h-5 w-5 font-semibold rounded-full`}
            />
            <div>
              {counts.length > 0 &&
                counts.find((values) => values._id === conversation.roomId) && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-semibold">
                    {
                      counts.find(
                        (values) => values._id === conversation.roomId
                      )?.unreadCount
                    }
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};
