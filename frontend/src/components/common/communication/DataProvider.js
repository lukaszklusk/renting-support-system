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

  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [firstMsgRender, setFirstMsgRender] = useState(false);

  const configCommunication = () => {
    if (isLoggedIn) {
      configWebSocket();
      console.log("configCommunication fetching");
      !isDataFetched && fetchData();
    } else {
      disconnect();
    }
  };

  const fetchData = async () => {
    try {
      console.log("fetcing data", !isDataFetched, username);
      await Promise.all([
        fetchMessages(),
        fetchApartments(),
        fetchAgreements(),
        fetchNotifications(),
      ]);
      console.log("setting is data fetch to true after fetching");
      setIsDataFetched(true);
    } catch (err) {
      console.log("err fetching data:", err);
      console.log("setting is data fetch to false after failed fetching");
      setIsDataFetched(false);
    }
  };

  const fetchAgreements = async () => {
    try {
      const data = await fetchUserAgreements(username);
      setAgreements(data);
    } catch (err) {
      console.log("error fetching apartments:", err);
      return err;
    }
  };

  const fetchApartments = async () => {
    try {
      const data = await fetchUserApartments(username);
      setApartments(data);
    } catch (err) {
      console.log("error fetching apartments:", err);
      return err;
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await fetchUserMessages(username);
      setMessages(data);
    } catch (err) {
      console.log("error fetching messages:", err);
      return err;
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await fetchUserNotifications(username);
      setNotifications(data);
    } catch (err) {
      console.log("error fetching notifications:", err);
      return err;
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
    console.log("setting is data fetch to false after receiving notif");
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
      console.log("setting is data fetch to false after auth change to null");
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
  useEffect(() => {
    username && !isDataFetched && fetchData();
  }, [isDataFetched]);

  useEffect(() => {
    console.log("on change isDataFetched:", isDataFetched);
  }, [isDataFetched]);

  useEffect(() => {
    setFirstMsgRender(true);
  }, [successMsg, errMsg]);

  useEffect(() => {
    console.log("render:", firstMsgRender);
    if (firstMsgRender) {
      setFirstMsgRender(false);
    } else {
      setSuccessMsg("");
      setErrMsg("");
    }
  });

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
        notifications,
        setNotifications,
        apartments,
        setApartments,
        agreements,
        setAgreements,
        isDataFetched,
        setIsDataFetched,

        sendMessage,

        successMsg,
        errMsg,
        setSuccessMsg,
        setErrMsg,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
