import React, { createContext, useState, useEffect, useMemo } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import useAxiosUser from "../../../hooks/useAxiosUser";

import useAuth from "../../../hooks/useAuth";

const CommunicationContext = createContext({});

export const CommunicationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const axiosUser = useAxiosUser();

  const { auth } = useAuth();

  const manageWebSocketConnection = () => {
    const isLoggedIn = auth?.isLoggedIn == true;
    if (isLoggedIn) {
      const socket = new SockJS("http://localhost:8080/ws");
      const stomp = Stomp.over(socket);
      setStompClient(stomp);
    }
    disconnect();
  };

  const connect = () => {
    stompClient?.connect({}, onConnected, onError);
  };

  const disconnect = () => {
    stompClient?.disconnect();
  };

  const onConnected = (frame) => {
    const username = auth?.username;
    const privateQueueUrl = `/user/queue/private`;
    // const privateQueueUrl = `/user/private`;
    // const privateQueueUrl = `/user/${username}/private`;

    console.log("connecting websocket to: " + privateQueueUrl);
    stompClient?.subscribe(privateQueueUrl, onReceivedMessage);
  };

  const onError = (err) => {
    console.log("Error during websocket connection:", err);
    refreshWebSocket();
  };

  const onReceivedMessage = (message) => {
    const receivedMessage = JSON.parse(message.body);
    console.log("received message: ", receivedMessage);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  const sendMessage = useMemo(() => {
    if (stompClient) {
      const queue = `/rent-sys/chat`;
      return (receiver, content) => {
        const date = new Date();
        const message = {
          receiver: receiver,
          content: content,
          sender: auth.username,
          sendTimestamp: date.getTime(),
        };
        stompClient.send(queue, {}, JSON.stringify(message));
      };
    }
    return () => {
      console.log("Stomp client not yet initialized");
    };
  }, [stompClient]);

  const refreshWebSocket = async () => {
    console.log("Refreshing websocket:");
    const refreshUrl = "http://localhost:8080/test";
    try {
      await axiosUser.get(refreshUrl);
    } catch (err) {
      console.log("Refreshing websocket error:", err);
    }
  };

  useEffect(manageWebSocketConnection, [auth]);
  useEffect(connect, [stompClient]);

  return (
    <CommunicationContext.Provider value={{ messages, sendMessage }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export default CommunicationContext;
