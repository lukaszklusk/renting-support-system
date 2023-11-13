import React, { useState, useEffect } from "react";

import useAuth from "../../../hooks/useAuth";
import useData from "../../../hooks/useData";
import { usePatchMessageReadStatus } from "../../../hooks/useCommunication";

import {
  getNotificationTitle,
  getNotificationContent,
} from "../../../hooks/useCommunication";

import {
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";

const Notifications = () => {
  const { auth } = useAuth();

  const { notifications, setNotifications } = useData();
  const patchMessageReadStatus = usePatchMessageReadStatus();

  const [sortedNotifications, setSortedNotifications] = useState([]);

  const timestampToDateString = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const displayContent = (notification) => {
    const content = getNotificationContent(notification);
    const displayedContent = notification?.isExpanded
      ? content
      : `${content.substring(0, 50)}...`;
    return displayedContent;
  };

  useEffect(() => {
    setSortedNotifications(
      notifications?.sort((notA, notB) => {
        return notB.sendTimestamp - notA.sendTimestamp;
      })
    );
  }, [notifications]);

  const expandNotification = (notificationId) => {
    const updatedNotifications = notifications?.map((notification) => {
      if (notification.id == notificationId) {
        const isExpanded = notification.hasOwnProperty("isExpanded")
          ? !notification.isExpanded
          : true;
        notification.isExpanded = isExpanded;
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const markAsRead = async (notification) => {
    if (!notification.isRead) {
      const username = auth?.username;
      const data = await patchMessageReadStatus(username, notification.id, {
        read: true,
      });

      const updatedNotifications = notifications?.map((notif) => {
        if (notif.id == notification.id) {
          return { ...data, isExpanded: true };
        }
        return notif;
      });

      setNotifications(updatedNotifications);
    }
  };

  const handleExpand = (notification) => {
    expandNotification(notification.id);
    markAsRead(notification);
  };

  return (
    <div>
      <h2>Notification List</h2>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {sortedNotifications?.map((notification, index) => (
          // <>
          <div key={index}>
            <ListItem key={index} alignItems="flex-start" disablePadding>
              <ListItemButton onClick={() => handleExpand(notification)}>
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={notification?.isRead ? "normal" : "bold"}
                      >
                        {getNotificationTitle(notification)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={notification?.isRead ? "normal" : "bold"}
                      >
                        {timestampToDateString(notification.sendTimestamp)}
                      </Typography>
                    </div>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight={notification?.isRead ? "normal" : "bold"}
                    >
                      {displayContent(notification)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index < sortedNotifications.length - 1 && (
              <Divider component="li" />
            )}
          </div>
        ))}
      </List>
    </div>
  );
};

export default Notifications;
