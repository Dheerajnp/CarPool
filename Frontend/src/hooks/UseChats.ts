import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEssentials } from "./UseEssentials";
import axiosApiGateway from "../functions/axios";
import  { io,Socket } from "socket.io-client";
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
interface IMessage {
  roomId: string;
  senderId: string;
  message: string;
  seen: Boolean;
  createdAt:string;
}

export function useChat() {
  const [query] = useSearchParams();
  const roomId = query.get("roomId");
  const { auth } = useEssentials();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);

  let userId = auth.user?._id ? auth.user?._id : auth.user?.id
  const socketRef = useRef<Socket>()


  useEffect(()=>{
    const connect = io(import.meta.env.VITE_SOCKET_URL);

    socketRef.current = connect;

    connect.on("getMessage",(data)=>{
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    })
  })
  useEffect(() => {

    if (userId) {
      
      axiosApiGateway
        .get(`/chat/user/getConversations/${userId}`)
        .then((response) => {
          if (response.data) {
            setConversations(response.data.result.chat);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [auth]);

  useEffect(() => {
    if (roomId && conversations.length > 0) {
      const selectedChat = conversations.find((chat) => chat.roomId === roomId);
      setSelectedConversation(selectedChat || null);
    }
    window.history.replaceState({}, "", window.location.pathname);
  }, [roomId, conversations]);

  useEffect(() => {
    if (selectedConversation?.roomId) {
      axiosApiGateway
        .get(`/chat/user/getMessages/${selectedConversation.roomId}`)
        .then((response) => {
          if (response.data.result.status === 200) {
            setMessages(response.data.result.messages);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedConversation]);

  return {
    conversations,
    selectedConversation,
    messages,
    setSelectedConversation,
    setMessages
  };
}
