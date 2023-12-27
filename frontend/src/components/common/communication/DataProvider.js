import React, { createContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

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
import { useUserPayments } from "../../../hooks/usePayments";
import {
  useUserMessages,
  useUserNotifications,
  getNotificationTitle,
} from "../../../hooks/useCommunication";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosUser = useAxiosUser();
  const location = useLocation();

  const fetchUserMessages = useUserMessages();
  const fetchUserApartments = useUserApartments();
  const fetchUserAgreements = useUserAgreements();
  const fetchUserNotifications = useUserNotifications();
  const fetchUserPayments = useUserPayments();

  const [messages, setMessages] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [payments, setPayments] = useState([]);
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

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

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
        fetchApartments(),
        fetchAgreements(),
        fetchPayments(),
        fetchMessages(),
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
      throw err;
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await fetchUserPayments(username);
      setPayments(data.filter((payment) => payment.status !== "cancelled"));
    } catch (err) {
      console.log("error fetching payments:", err);
      throw err;
    }
  };

  const fetchApartments = async () => {
    try {
      const data = await fetchUserApartments(username);
      setApartments(data);
    } catch (err) {
      console.log("error fetching apartments:", err);
      throw err;
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await fetchUserMessages(username);
      setMessages(data);
    } catch (err) {
      console.log("error fetching messages:", err);
      throw err;
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await fetchUserNotifications(username);
      setNotifications(
        data?.sort((notA, notB) => {
          return notB.sendTimestamp - notA.sendTimestamp;
        })
      );
    } catch (err) {
      console.log("error fetching notifications:", err);
      throw err;
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

  const onReceivedNotification = (notificationResponse) => {
    const notification = JSON.parse(notificationResponse.body);
    console.log("received notification:", notification);
    if (notification.receiver === username) {
      console.log("setting is data fetch to false after receiving notif");
      notification.receiver === username && setIsDataFetched(false);
    }
    showNotification(notification);
    setNotifications((prevNotifications) =>
      [...prevNotifications, notification]?.sort((notA, notB) => {
        return notB.sendTimestamp - notA.sendTimestamp;
      })
    );
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

  const onSuccessMsg = (msg) => {
    sessionStorage.setItem("successMsg", msg);
    setSuccessMsg(msg);
  };

  const onErrMsg = (msg) => {
    sessionStorage.setItem("errMsg", msg);
    setErrMsg(msg);
  };

  const onPathChange = () => {
    const successMsg = sessionStorage.getItem("successMsg");
    const errMsg = sessionStorage.getItem("errMsg");

    if (successMsg !== "") {
      sessionStorage.removeItem("successMsg");
      setSuccessMsg(successMsg);
    }
    if (errMsg !== "") {
      sessionStorage.removeItem("errMsg");
      setErrMsg(errMsg);
    }
  };

  const onResize = () => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  useEffect(onResize, []);
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

  useEffect(onPathChange, [location.pathname]);

  const showNotification = (notification) => {
    const content = getNotificationTitle(notification, username);

    toast.info(content, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
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

        agreements,
        apartments,
        payments,
        messages,
        notifications,

        setAgreements,
        setApartments,
        setPayments,
        setMessages,
        setNotifications,

        isDataFetched,
        setIsDataFetched,

        sendMessage,

        successMsg,
        errMsg,
        setSuccessMsg,
        setErrMsg,

        onSuccessMsg,
        onErrMsg,

        screenSize,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
