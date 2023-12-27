import useGetRequest from "./useGetRequest";
import usePatchRequest from "./usePatchRequest";

import { parseISO, format } from "date-fns";

export const getNotificationTitle = (notification, username) => {
  switch (notification?.notificationType) {
    case "equipment_added":
      if (notification.sender === username) {
        return "New Equipment Added By You";
      } else {
        return `New Equipment Added By ${notification.sender}`;
      }
    case "equipment_failure":
      if (notification.sender === username) {
        return "Equipment Failure Reported By You";
      } else {
        return `Equipment Failure Reported By ${notification.sender}`;
      }
    case "equipment_fix":
      if (notification.sender === username) {
        return "Equipment Fix Reported By You";
      } else {
        return `Equipment Fix Reported By ${notification.sender}`;
      }
    case "equipment_removed":
      if (notification.sender === username) {
        return "Equipment Removed By You";
      } else {
        return `Equipment Removed By ${notification.sender}`;
      }
    case "apartment_created":
      return "Apartment Created";
    case "apartment_removed":
      return "Apartment Removed";
    case "agreement_activated":
      if (notification.sender === username) {
        return "Agreement Activated By You";
      } else {
        return `Agreement Activated By ${notification.sender}`;
      }
    case "agreement_proposed":
      if (notification.sender === username) {
        return "Agreement Proposed By You";
      } else {
        return `Agreement Proposed By ${notification.sender}`;
      }
    case "agreement_accepted":
      if (notification.sender === username) {
        return "Agreement Accepted By You";
      } else {
        return `Agreement Accepted By ${notification.sender}`;
      }
    case "agreement_rejected_client":
    case "agreement_rejected_owner":
      if (notification.sender === username) {
        return "Agreement Rejected By You";
      } else {
        return `Agreement Rejected By ${notification.sender}`;
      }
    case "agreement_withdrawn_client":
    case "agreement_withdrawn_owner":
      if (notification.sender === username) {
        return "Agreement Withdrawn By You";
      } else {
        return `Agreement Withdrawn By ${notification.sender}`;
      }
    case "agreement_cancelled_owner":
    case "agreement_cancelled_client":
      if (notification.sender === username) {
        return "Agreement Cancelled By You";
      } else {
        return `Agreement Cancelled By ${notification.sender}`;
      }
    case "payment_owner":
      if (notification.sender === username) {
        return "Payment Confirmation By You";
      } else {
        return `Payment Confirmation By ${notification.sender}`;
      }
    case "payment_late_owner":
      if (notification.sender === username) {
        return "Late Payment Confirmation By You";
      } else {
        return `Late Payment Confirmation By ${notification.sender}`;
      }
    case "payment_client":
      if (notification.sender === username) {
        return "Payment Submission By You";
      } else {
        return `Payment Submission By ${notification.sender}`;
      }
    case "payment_late_client":
      if (notification.sender === username) {
        return "Delayed Payment Submission By You";
      } else {
        return `Delayed Payment Submission By ${notification.sender}`;
      }
    case "payment_due":
      if (notification.sender === username) {
        return "New Accouting Period";
      } else {
        return `New Accouting Period For ${notification.sender}`;
      }
    case "payment_overdue":
      if (notification.sender === username) {
        return "Delayed Payment Due By You";
      } else {
        return `Delayed Payment Due By ${notification.sender}`;
      }
    default:
      return "Unknown argument";
  }
};

export const getNotificationContent = (notification, username) => {
  const dates = notification.notifiableRelatedName.split(" ");
  switch (notification?.notificationType) {
    case "equipment_added":
      if (notification.sender === username) {
        return `You added new equipment '${notification.notifiableName}' to an apartment '${notification.notifiableRelatedName}'`;
      } else {
        return `User ${notification.sender} added new equipment '${notification.notifiableName}' to your apartment '${notification.notifiableRelatedName}'`;
      }
    case "equipment_failure":
      if (notification.sender === username) {
        return `You reported failure of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      } else {
        return `User ${notification.sender} reported failure of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      }
    case "equipment_fix":
      if (notification.sender === username) {
        return `You reported fix of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      } else {
        return `User ${notification.sender} reported fix of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      }
    case "equipment_removed":
      if (notification.sender === username) {
        return `You reported removal of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      } else {
        return `User ${notification.sender} reported removal of '${notification.notifiableName}' in an apartment '${notification.notifiableRelatedName}'`;
      }
    case "apartment_created":
      return `You created a new apartment '${notification.notifiableName}'`;
    case "apartment_removed":
      return `You removed an apartment '${notification.notifiableName}'`;
    case "agreement_activated":
      if (notification.sender === username) {
        return `You activated an agreement '${notification.notifiableName}' and rented an apartment '${notification.notifiableRelatedName}' to a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} activated an agreement '${notification.notifiableName}' and rented an apartment '${notification.notifiableRelatedName}' to you`;
      }
    case "agreement_proposed":
      if (notification.sender === username) {
        return `You proposed an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' to a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} proposed you an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }
    case "agreement_accepted":
      if (notification.sender === username) {
        return `You agreed to an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' proposed by a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} agreed to an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }
    case "agreement_withdrawn_owner":
      if (notification.sender === username) {
        return `You withdrawn an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' proposed to user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} withdrawn an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }

    case "agreement_withdrawn_client":
      if (notification.sender === username) {
        return `You withdrawn acceptance of agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' proposed by user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} withdrawn acceptance of an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }

    case "agreement_rejected_client":
      if (notification.sender === username) {
        return `You rejected an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'. proposed by a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} rejected proposed by you agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }
    case "agreement_rejected_owner":
      if (notification.sender === username) {
        return `You rejected an agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' accepted by a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} rejected previously accepted by you agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }
    case "agreement_cancelled_owner":
    case "agreement_cancelled_client":
      if (notification.sender === username) {
        return `You cancelled an active agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}' concluded with a user ${notification.receiver}`;
      } else {
        return `User ${notification.sender} cancelled active agreement '${notification.notifiableName}' related to an apartment '${notification.notifiableRelatedName}'`;
      }

    case "payment_owner":
      if (notification.sender === username) {
        return `You confirmed a payment made by a user ${
          notification.receiver
        } for an apartment '${notification.notifiableName}' for ${parseISO(
          dates[0]
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      } else {
        return `User ${
          notification.sender
        } confirmed a payment made by you for an apartment '${
          notification.notifiableName
        }' for ${parseISO(dates[0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      }
    case "payment_late_owner":
      if (notification.sender === username) {
        return `You confirmed a delayed payment (due date: ${
          dates[2]
        }) made by a user ${notification.receiver} for an apartment '${
          notification.notifiableName
        }' for ${parseISO(dates[0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      } else {
        return `User ${
          notification.sender
        } confirmed a delayed payment (due date: ${
          dates[2]
        }) made by you for an apartment '${
          notification.notifiableName
        }' for ${parseISO(dates[0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      }
    case "payment_client":
      if (notification.sender === username) {
        return `You made a payment for an apartment '${
          notification.notifiableName
        }' for ${parseISO(dates[0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      } else {
        return `User ${notification.sender} made a payment for an apartment '${
          notification.notifiableName
        }' for ${parseISO(dates[0]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      }
    case "payment_late_client":
      if (notification.sender === username) {
        return `You made a delayed payment (due date: ${
          dates[2]
        }) for an apartment '${notification.notifiableName}' for ${parseISO(
          dates[0]
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      } else {
        return `User ${notification.sender} made a delayed payment (due date: ${
          dates[2]
        }) for an apartment '${notification.notifiableName}' for ${parseISO(
          dates[0]
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} (${dates[0]} : ${dates[1]})`;
      }
    case "payment_due":
      return `You started new accouting period in an apartment '${
        notification.notifiableName
      }' for  for ${parseISO(dates[0]).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })} (${dates[0]} : ${dates[1]}) with due date on ${dates[2]}`;
    case "payment_overdue":
      if (notification.sender === username) {
        return `You haven't made a payment for an apartment '${notification.notifiableName}' in time`;
      } else {
        return `User ${notification.sender} hasn't made a payment for an apartment '${notification.notifiableName}' in time`;
      }

    default:
      return "Unknown argument";
  }
};

export const getNotificationColor = (notification) => {
  const type = notification.notificationType;
  if (type.includes("apartment")) {
    return "blue";
  } else if (type.includes("agreement")) {
    return "green";
  } else if (type.includes("equipment")) {
    return "purple";
  } else if (type.includes("payment")) {
    return "orange";
  }
};

export const getNotificationPriorityText = (notification) => {
  if (notification.priority === "important") {
    return "❗";
  } else if (notification.priority === "critical") {
    return "❗❗❗";
  }
};

const getBaseUserUrl = (username) => {
  return `/user/${username}`;
};

const getBaseNotificationsUrl = (username) => {
  return `/user/${username}/notifications`;
};

const getBaseMessagesUrl = (username) => {
  return `/user/${username}/messages`;
};

export const useUserMessages = () => {
  const fetchData = useGetRequest();

  const fetchUserMessages = async (username) => {
    const url = getBaseMessagesUrl(username);
    return fetchData(url);
  };
  return fetchUserMessages;
};

export const useUserNotifications = () => {
  const fetchData = useGetRequest();

  const fetchUserNotifications = async (username) => {
    const url = getBaseNotificationsUrl(username);
    return fetchData(url);
  };
  return fetchUserNotifications;
};

export const usePatchMessageReadStatus = () => {
  const patchData = usePatchRequest();

  const patchMessageReadStatus = async (username, id, status) => {
    const BASE_URL = getBaseNotificationsUrl(username);
    const url = `${BASE_URL}/${id}/read`;
    return patchData(url, status);
  };
  return patchMessageReadStatus;
};

export const useUser = () => {
  const fetchedData = useGetRequest();

  const fetchUserByUsername = async (username) => {
    const url = getBaseUserUrl(username);
    return fetchedData(url);
  };
  return fetchUserByUsername;
};
