import React, { createContext, useState, useEffect, useMemo } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import useAxiosUser from "../../../hooks/useAxiosUser";

import useAuth from "../../../hooks/useAuth";
import useUserMessages from "../../../hooks/messages/useUserMessages";

import { v4 as uuidv4 } from "uuid";

const CommunicationContext = createContext({});

export const CommunicationProvider = ({ children }) => {
  const { auth } = useAuth();

  const fetchUserMessages = useUserMessages();
  const axiosUser = useAxiosUser();

  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const configCommunication = () => {
    if (isLoggedIn) {
      configWebSocket();
      fetchMessages();
    } else {
      disconnect();
    }
  };

  const fetchMessages = async () => {
    try {
      const username = auth.username;
      const response = await fetchUserMessages(username);
      setMessages(response);
    } catch (err) {
      console.log("error fetching messages:", err);
    }
  };

  const configWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
  };

  const connect = () => {
    console.log("connect:", isLoggedIn && stompClient?.connect);
    isLoggedIn && stompClient?.connect({}, onConnected, onError);
  };

  const disconnect = () => {
    stompClient?.connected && stompClient?.disconnect();
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
    console.log("stompClient:", stompClient);
    const receivedMessage = JSON.parse(message.body);
    console.log("received message: ", receivedMessage);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  // const sendMessage = useMemo(() => {
  //   console.log("sending message");
  //   if (stompClient) {
  //     const queue = `/rent-sys/chat`;
  //     return (receiver, content) => {
  //       const date = new Date();
  //       const message = {
  //         receiver: receiver,
  //         content: content,
  //         sender: auth.username,
  //         sendTimestamp: date.getTime(),
  //       };
  //       stompClient.send(queue, {}, JSON.stringify(message));
  //     };
  //   }
  //   return () => {
  //     console.log("Stomp client not yet initialized");
  //   };
  // }, [stompClient]);

  const sendMessage = (receiver, content) => {
    console.log("sending message: ", receiver, content);
    if (stompClient?.connected) {
      console.log("stompClient:", stompClient);
      const queue = `/rent-sys/chat`;
      const date = new Date();
      const message = {
        id: uuidv4(),
        receiver: receiver,
        content: content,
        sender: auth.username,
        sendTimestamp: date.getTime(),
      };
      console.log("message:", message);
      // setMessages([...messages, message]);
      setMessages((prevMessages) => [...prevMessages, message]);
      stompClient.send(queue, {}, JSON.stringify(message));
    }
    return () => {
      console.log("Stomp client not yet initialized");
      connect();
    };
  };

  const refreshWebSocket = async () => {
    console.log("Refreshing websocket:");
    const refreshUrl = "http://localhost:8080/test";
    try {
      await axiosUser.get(refreshUrl);
    } catch (err) {
      console.log("Refreshing websocket error:", err);
    }
  };

  useEffect(configCommunication, [isLoggedIn]);
  useEffect(connect, [stompClient]);
  useEffect(() => {
    setIsLoggedIn(auth?.isLoggedIn == true);
  }, [auth]);

  return (
    <CommunicationContext.Provider
      value={{ messages, setMessages, sendMessage }}
    >
      {children}
    </CommunicationContext.Provider>
  );
};

export default CommunicationContext;
