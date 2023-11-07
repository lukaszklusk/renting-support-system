import React, { createContext, useState, useEffect, useMemo } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { ROLES } from "../../../config/roles";

import useAuth from "../../../hooks/useAuth";
import useAxiosUser from "../../../hooks/useAxiosUser";
import { useUserApartments } from "../../../hooks/useApartments";
import { useUserAgreements } from "../../../hooks/useAgreements";
import {
  useUserMessages,
  useUserNotifications,
  getNotificationTitle,
} from "../../../hooks/useCommunication";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosUser = useAxiosUser();

  const fetchUserMessages = useUserMessages();
  const fetchUserApartments = useUserApartments();
  const fetchUserAgreements = useUserAgreements();
  const fetchUserNotifications = useUserNotifications();

  const [messages, setMessages] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [stompClient, setStompClient] = useState(null);

  const [username, setUsername] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log("isDataFetched:", isDataFetched);
  const configCommunication = () => {
    if (isLoggedIn) {
      configWebSocket();
      // TODO
      fetchData();
    } else {
      disconnect();
    }
  };

  const fetchData = () => {
    if (isLoggedIn && !isDataFetched) {
      fetchMessages();
      fetchNotifications();
      fetchApartments();
      fetchAgreements();
      setIsDataFetched(true);
    }
  };

  const fetchAgreements = async () => {
    try {
      const data = await fetchUserAgreements(username);
      setAgreements(data);
    } catch (err) {
      console.log("error fetching apartments:", err);
    }
  };

  const fetchApartments = async () => {
    try {
      const data = await fetchUserApartments(username);
      setApartments(data);
    } catch (err) {
      console.log("error fetching apartments:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await fetchUserMessages(username);
      setMessages(data);
    } catch (err) {
      console.log("error fetching messages:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await fetchUserNotifications(username);
      setNotifications(data);
    } catch (err) {
      console.log("error fetching notifications:", err);
    }
  };

  const configWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
  };

  const connect = () => {
    isLoggedIn && stompClient?.connect({}, onConnected, onError);
  };

  const disconnect = () => {
    stompClient?.connected && stompClient?.disconnect();
  };

  const onConnected = (frame) => {
    const messagesChannel = "/user/dm";
    const notificationsChannel = "/user/notifications";

    stompClient?.subscribe(messagesChannel, onReceivedMessage);
    stompClient?.subscribe(notificationsChannel, onReceivedNotification);
  };

  const onError = (err) => {
    console.log("Error during websocket connection:", err);
    refreshWebSocket();
  };

  const onReceivedMessage = (message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  const onReceivedNotification = (notification) => {
    const receivedNotification = JSON.parse(notification.body);
    setIsDataFetched(false);
    showNotification(receivedNotification);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      receivedNotification,
    ]);
  };

  const sendMessage = (receiver, content) => {
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

  const onAuthChange = () => {
    setIsLoggedIn(auth?.isLoggedIn == true);
    if (auth?.username) {
      setUsername(auth?.username);
    } else {
      setUsername(null);
      setIsDataFetched(false);
    }
  };

  const onIsLoggedInChange = () => {
    setIsClient(isLoggedIn && auth?.roles?.includes(ROLES.client));
    setIsOwner(isLoggedIn && auth?.roles?.includes(ROLES.owner));
    setIsAdmin(isLoggedIn && auth?.roles?.includes(ROLES.admin));
  };

  useEffect(configCommunication, [isLoggedIn]);
  useEffect(connect, [stompClient]);
  useEffect(onAuthChange, [auth]);
  useEffect(onIsLoggedInChange, [isLoggedIn]);
  useEffect(fetchData, [isDataFetched]);

  const showNotification = (notification) => {
    const content = getNotificationTitle(notification);
    toast.success(content, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <DataContext.Provider
      value={{
        username,
        isLoggedIn,
        isClient,
        isOwner,
        isAdmin,

        messages,
        setMessages,
        sendMessage,
        notifications,
        setNotifications,
        apartments,
        setApartments,
        agreements,
        setAgreements,
        isDataFetched,
        setIsDataFetched,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
