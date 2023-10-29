import React, { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Tutaj można zainicjować połączenie WebSocket i obsługiwać wiadomości przychodzące

  useEffect(() => {
    // Inicjacja połączenia WebSocket i obsługa wiadomości
    const socket = new WebSocket("ws://adres-serwera-websocket");
    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // Utwórz funkcję do wysyłania wiadomości na serwer WebSocket
    const sendMessage = (message) => {
      socket.send(JSON.stringify(message));
    };
  }, []);

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
