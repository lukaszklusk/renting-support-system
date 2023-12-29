import React, { useState, useEffect } from "react";
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useData from "../../../hooks/useData";
import { usePatchMessageReadStatus } from "../../../hooks/useCommunication";

import {
  getNotificationTitle,
  getNotificationContent,
  getNotificationColor,
  getNotificationPriorityText,
} from "../../../hooks/useCommunication";

import {
  Box,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";

import SectionHeader from "../SectionHeader";

import { FilterCircle, SquareFill, ExclamationLg } from "react-bootstrap-icons";

const Notifications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const { username, notifications, setNotifications } = useData();
  const patchMessageReadStatus = usePatchMessageReadStatus();

  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [loadedNotificationsNr, setLoadedNotificationsNr] = useState(0);

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersApplyEnable, setFiltersApplyEnable] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    type: [],
    read: [],
  });

  const onFiltersChange = () => {
    setFiltersApplyEnable(
      selectedFilters.priority.length > 0 &&
        selectedFilters.type.length > 0 &&
        selectedFilters.read.length > 0
    );
  };

  useEffect(onFiltersChange, [selectedFilters]);

  console.log("notifications:", notifications);

  const onToggleFilter = (category, filterValue) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const idx = updatedFilters[category].indexOf(filterValue);
      idx !== -1
        ? updatedFilters[category].splice(idx, 1)
        : updatedFilters[category].push(filterValue);
      return updatedFilters;
    });
  };

  const onFiltersOpen = () => {
    setFiltersOpen(true);
  };

  const onFiltersClose = () => {
    setFiltersOpen(false);
  };

  const onFiltersApply = () => {
    const params = new URLSearchParams();

    Object.keys(selectedFilters).forEach((category) => {
      params.append(category, selectedFilters[category].join(","));
    });

    navigate(`/notifications?${params.toString()}`);
    onFiltersClose();
  };

  const onPageUpdate = () => {
    const queryParams = new URLSearchParams(location.search);

    const filters = {};
    queryParams.forEach((value, key) => {
      if (!filters[key]) {
        filters[key] = value.split(",");
      } else {
        filters[key].push(...value.split(","));
      }
    });
    filters["read"] = filters["read"]?.map((v) =>
      v === "true" ? true : false
    );

    const paramPage = parseInt(queryParams.get("page"));
    const loadedPage = paramPage ? paramPage : 1;

    const toFilter = ["priority", "type", "read"].every((filter) =>
      filters.hasOwnProperty(filter)
    );

    const startIdx = (loadedPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const loadedNotifications = toFilter
      ? notifications
          .filter((n) => filters.priority.includes(n.priority))
          .filter((n) => filters.read.includes(n.isRead))
          .filter((n) =>
            filters.type.some((type) => n.notificationType.includes(type))
          )
      : notifications;

    setLoadedNotificationsNr(loadedNotifications.length);

    setDisplayedNotifications(loadedNotifications.slice(startIdx, endIdx));

    setPage(loadedPage);
  };

  useEffect(onPageUpdate, [location, notifications]);

  const handlePageChange = (_, newPage) => {
    query.set("page", newPage);
    navigate(`/notifications?${query.toString()}`);
  };

  const timestampToDateString = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const displayContent = (notification) => {
    const content = getNotificationContent(notification, username);
    const displayedContent = content
      ? content
      : `${content.substring(0, 50)}...`;
    return displayedContent;
  };

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
    <React.Fragment>
      {notifications?.length ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {displayedNotifications?.map((notification, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemButton onClick={() => handleExpand(notification)}>
                    <SquareFill
                      color={getNotificationColor(notification)}
                      className="me-3"
                    />
                    <ListItemText
                      primary={
                        <div className="d-flex justify-content-between">
                          <Typography
                            variant="subtitle1"
                            color="text.primary"
                            fontWeight={
                              notification?.isRead ? "normal" : "bold"
                            }
                          >
                            {getNotificationTitle(notification, username)}
                            <span className="ms-1">
                              {getNotificationPriorityText(notification)}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            fontWeight={
                              notification?.isRead ? "normal" : "bold"
                            }
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
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
          <Pagination
            count={Math.ceil(loadedNotificationsNr / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            component="div"
            sx={{ marginBottom: "5px", justifyContent: "center" }}
          />
          <IconButton onClick={onFiltersOpen}>
            <FilterCircle />
          </IconButton>
          <Dialog onClose={onFiltersClose} open={filtersOpen}>
            <DialogTitle>Filter Notifications</DialogTitle>
            <DialogContent>
              <div className="mb-4">
                <strong>Priority:</strong>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.priority.indexOf("normal") !== -1}
                    onChange={() => onToggleFilter("priority", "normal")}
                  />{" "}
                  Normal
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters.priority.indexOf("important") !== -1
                    }
                    onChange={() => onToggleFilter("priority", "important")}
                  />{" "}
                  Important
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters.priority.indexOf("critical") !== -1
                    }
                    onChange={() => onToggleFilter("priority", "critical")}
                  />{" "}
                  Critical
                </label>
                <br />
              </div>

              <div className="mb-4">
                <strong>Type:</strong>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.type.indexOf("apartment") !== -1}
                    onChange={() => onToggleFilter("type", "apartment")}
                  />{" "}
                  Apartments
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.type.indexOf("agreement") !== -1}
                    onChange={() => onToggleFilter("type", "agreement")}
                  />{" "}
                  Agreements
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.type.indexOf("equipment") !== -1}
                    onChange={() => onToggleFilter("type", "equipment")}
                  />{" "}
                  Equipment
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.type.indexOf("payment") !== -1}
                    onChange={() => onToggleFilter("type", "payment")}
                  />{" "}
                  Payments
                </label>
                <br />
              </div>

              <div className="mb-2">
                <strong>Read:</strong>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.read.indexOf(true) !== -1}
                    onChange={() => onToggleFilter("read", true)}
                  />{" "}
                  Yes
                </label>
                <br />
                <label className="my-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.read.indexOf(false) !== -1}
                    onChange={() => onToggleFilter("read", false)}
                  />{" "}
                  No
                </label>
                <br />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onFiltersClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={onFiltersApply}
                color="primary"
                disabled={!filtersApplyEnable}
              >
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <SectionHeader title="No Notifications" />
      )}
    </React.Fragment>
  );
};

export default Notifications;
