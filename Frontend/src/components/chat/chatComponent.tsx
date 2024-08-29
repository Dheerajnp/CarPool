import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import nochat from "../../assets/no chat.png";
import { format } from "timeago.js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import Header from "../Navbar";
import { ScrollArea } from "../ui/scroll-area";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { User2Icon } from "lucide-react";
import { FiSend } from "react-icons/fi";
import { useEssentials } from "../../hooks/UseEssentials";
import { useChat } from "../../hooks/UseChats";
import { ConversationList } from "./ChatConversationListing";
import { useEffect, useRef, useState } from "react";
import axiosApiGateway from "../../functions/axios";
import useSocket from "../../hooks/UseSocket";

interface onlineUserFindType {
  userId: string;
}
export default function Component() {
  const {
    conversations,
    selectedConversation,
    messages,
    setMessages,
    setSelectedConversation,
  } = useChat();

  const { auth } = useEssentials();

  const [chatMessage, setChatMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const socket = useSocket(selectedConversation?.roomId as string);
  const [onlineUser, setOnlineUser] = useState<onlineUserFindType[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log("socket")
    socket?.emit("addUser", auth.user?.id);
    socket?.on("getUsers", (users) => {
      console.log("users", users);
      setOnlineUser(users);
    });
  }, [socket,auth.user?.id]);
  console.log(onlineUser)

  const handleMessageSend = async () => {
    if (chatMessage.trim() === "") return;
    await sendMessageToChat(chatMessage);
    setChatMessage("");
  };

  const sendMessageToChat = async (chatMessage: string) => {
    await axiosApiGateway
      .post(`/chat/${auth.user?.id}`, {
        message: chatMessage,
        roomId: selectedConversation?.roomId,
      })
      .then((response) => {
        console.log(response.data.result);
        socket?.emit("newMessage", response.data.result.chatMessage);
      })
      .catch((error) => {
        console.error(error);
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="w-full flex justify-center">
      <header className="bg-background border-b  fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>
      <div className="flex justify-center">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          onlineUser={onlineUser}
        />
        <div className="bg-background rounded-e-lg w-[70vw] border p-6 mt-20 flex flex-col gap-4  h-[calc(98vh-80px)]">
          {selectedConversation && selectedConversation.driver ? (
            <>
              <div className="sticky top-0 left-0 right-0 bg-background z-10 py-3 -mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border">
                      <AvatarImage
                        src={
                          auth.user?.role === "rider"
                            ? selectedConversation.driver.profile
                            : selectedConversation.user.profile
                        }
                        alt="Driver Avatar"
                      />
                      <AvatarFallback>
                        {auth.user?.role === "rider"
                          ? selectedConversation.driver.name
                              .slice(0, 2)
                              .toUpperCase()
                          : selectedConversation.user.name
                              .slice(0, 2)
                              .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {auth.user?.role === "rider"
                          ? selectedConversation.driver.name
                          : selectedConversation.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Online
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MdOutlineArrowDropDownCircle className="w-7 h-7" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User2Icon className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CiPhone className="w-4 h-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IoMdClose className="w-4 h-4 mr-2" />
                        Close Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <ScrollArea className="flex-1 overflow-auto -mt-2">
                {messages && messages.length > 0 ? (
                  messages.map((message) => (
                    <div className="grid gap-4 " ref={scrollRef}>
                      {message.senderId == auth.user?.id ? (
                        <div
                          className="flex items-start gap-3"
                          id={message.roomId}
                        >
                          <Avatar className="w-8 h-8 border mt-2">
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="User Avatar"
                            />
                            <AvatarFallback>
                              {auth.user.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg p-3 max-w-[75%] mt-2">
                            <p className="text-sm text-wrap break-words max-w-full">
                              <span className="block max-w-[90%]">
                                {message.message}
                              </span>
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-primary rounded-lg p-3 max-w-[75%] text-primary-foreground mt-1">
                            <p className="text-sm">{message.message}</p>
                            <div className="text-xs text-primary-foreground/80 mt-1">
                              {format(message.createdAt)}
                            </div>
                          </div>
                          <Avatar className="w-8 h-8 border mt-1 me-3">
                            <AvatarImage
                              src="/placeholder-driver.jpg"
                              alt="Driver Avatar"
                            />
                            <AvatarFallback>
                              {auth.user?.role === "rider"
                                ? selectedConversation.driver.name
                                    .slice(0, 2)
                                    .toUpperCase()
                                : selectedConversation.user.name
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img
                      src={nochat}
                      alt="No chat"
                      className="w-28 h-28 opacity-50 mt-24"
                    />
                    <p className="text-muted-foreground text-sm mt-4">
                      No messages yet.
                    </p>
                  </div>
                )}
              </ScrollArea>

              <div className=" bottom-0 left-0 right-0 mt-4 ">
                <div className="flex gap-3 items-center justify-center align-middle">
                  <Textarea
                    placeholder="Type your message"
                    className="resize-none"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleMessageSend()} // Send message on Enter key press
                  />
                  <Button
                    size="icon"
                    className=" w-8 h-8 top-3 right-3"
                    onClick={handleMessageSend}
                  >
                    <FiSend className="w-4 h-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src={nochat}
                alt="No chat selected"
                className="w-24 h-24 opacity-50"
              />
              <p className="text-muted-foreground text-sm mt-4">
                Select a conversation to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
