import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEssentials } from "./UseEssentials";
import axiosApiGateway from "../functions/axios";

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

  useEffect(() => {
    if (auth.user?.id) {
      
      axiosApiGateway
        .get(`/chat/user/getConversations/${auth.user?.id}`)
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
