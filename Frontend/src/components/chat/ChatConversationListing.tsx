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

interface onlineUserFindType {
  userId: string;
}

interface ConversationListProps {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  setSelectedConversation: (conversation: IConversation) => void;
  onlineUser: onlineUserFindType[];
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  onlineUser
}) => {
 
  const isUserOnline = (userId:string)=>{
    return onlineUser.some(user => user.userId === userId);
  }


  const { auth } = useEssentials();
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
                  isOnline  ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            <div className="flex-1">
              <div className="font-medium flex justify-between items-center">
                <span>{displayUser.name}</span>
                <span className="text-xs text-muted-foreground">
                  {displayUser ? "Online" : "Offline"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {conversation.lastMessage}
              </div>
            </div>
            {/* Unread message indicator */}
            <div
              className={`absolute right-2 top-2 h-3 w-3 rounded-full ${
                conversation.seen ? "bg-transparent" : "bg-red-500"
              }`}
            />
          </div>
        );
      })}
    </ScrollArea>
  );
};
