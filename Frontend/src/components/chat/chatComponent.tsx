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
import Header from "../Common/Navbar";
import { ScrollArea } from "../ui/scroll-area";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { useEssentials } from "../../hooks/UseEssentials";
import { useChat } from "../../hooks/UseChats";
import { ConversationList } from "./ChatConversationListing";
import { useEffect, useMemo, useRef, useState } from "react";
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
  let userId = auth.user?._id ? auth.user?._id : auth.user?.id;

  console.log(userId);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(conversations)
  const recieverId = useMemo(() => {
    if (!selectedConversation || !userId) return null;
    console.log(selectedConversation)
    if (userId === selectedConversation.driver?._id) {
      return selectedConversation.user._id;
    } else if (userId === selectedConversation.user?._id) {
      return selectedConversation.driver._id;
    }

    return null;
  }, [selectedConversation, auth, userId]);
  const socket = useSocket();
  const [onlineUser, setOnlineUser] = useState<onlineUserFindType[]>([]);
  const [counts, setCount] = useState<{ _id: string; unreadCount: number }[]>(
    []
  );
  function setCountings(roomId: string) {
    setCount((prevCounts) => {
      let fount = false;
      // Map over previous counts to update the unread count
      const updatedCounts = prevCounts.map((count) => {
        if (count._id === roomId) {
          fount = true;
          return { ...count, unreadCount: count.unreadCount + 1 };
        }
        return count;
      });

      // If no matching roomId was found, add a new entry
      if (!fount) {
        return [...updatedCounts, { _id: roomId, unreadCount: 1 }];
      }

      return updatedCounts;
    });
  }

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data: any) => {
        console.log(data);
        if (data.roomId === selectedConversation?.roomId) {
          return setMessages((prevMessages) => [...prevMessages, data]);
        }
        console.log(data.roomId);
        console.log(counts);
        setCountings(data.roomId);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedConversation, setMessages, setCountings]);

  useEffect(() => {
    if (socket && conversations.length > 0 && auth && auth.user) {
      console.log(conversations);
      const usrs = conversations.map((conv) => {
        if (auth.user?.role === "rider") {
          return conv.user._id;
        } else if (auth.user?.role === "host") {
          return conv.driver._id;
        }
        return null;
      });
      console.log(usrs);
      socket?.emit("getUsers", usrs);
      socket.emit("sendonline", userId, auth.user.role);
    }
  }, [conversations, socket, auth, auth.user]);
  useEffect(() => {
    socket?.on("online", (userId: string) => {
      setOnlineUser(
        [...onlineUser, { userId: userId }].filter(
          (values, idx, arr) => arr.indexOf(values) === idx
        )
      );
    });
    socket?.on("getUsers", (users: string[]) => {
      console.log("getUsers", users);
      setOnlineUser([
        ...onlineUser,
        ...users.map((values) => {
          return {
            userId: values,
          };
        }),
      ]);
    });

    () => {
      socket?.off("online");
      socket?.off("getUsers");
    };
  }, [socket]);
  const handleMessageSend = async () => {
    if (chatMessage.trim() === "") return;
    await sendMessageToChat(chatMessage);
    setChatMessage("");
  };

  const sendMessageToChat = async (chatMessage: string) => {
    await axiosApiGateway
      .post(`/chat/${userId}`, {
        message: chatMessage,
        roomId: selectedConversation?.roomId,
      })
      .then((response) => {
        console.log(response.data.result);
        socket?.emit("newMessage", {
          message: response.data.result.chatMessage,
          recieverId: recieverId,
        });
        setMessages([...messages, response.data.result.chatMessage]);
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
          counts={counts}
          setCount={setCount}
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IoMdClose
                          className="w-4 h-4 mr-2"
                          onClick={() => window.location.reload()}
                        />
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
                      {message.senderId == userId ? (
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
                              {userId?.slice(0, 2).toUpperCase()}
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
