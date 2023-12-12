import useGetRequest from "./useGetRequest";
import usePatchRequest from "./usePatchRequest";

export const getNotificationTitle = (notification) => {
  switch (notification?.notificationType) {
    case "equipment_added":
      return "New Equipment Added";
    case "equipment_failure":
      return "Equipment Failure Reported";
    case "equipment_fix":
      return "Equipment Fix Reported";
    case "equipment_removed":
      return "Equipment Removed";
    case "apartment_created":
      return "Apartment Created";
    case "apartment_removed":
      return "Apartment Removed";
    case "agreement_activated":
      return "Agreement Activated";
    case "agreement_proposed":
      return "Agreement Proposed";
    case "agreement_accepted":
      return "Agreement Accepted";
    case "agreement_rejected_client":
      return "Agreement Rejected By Client";
    case "agreement_rejected_owner":
      return "Agreement Rejected By Owner";
    case "agreement_withdrawn_client":
      return "Agreement Withdrawn By Client";
    case "agreement_withdrawn_owner":
      return "Agreement Withdrawn By Owner";
    case "agreement_cancelled_owner":
      return "Agreement Cancelled By Owner";
    case "agreement_cancelled_client":
      return "Agreement Cancelled By Client";
    default:
      return "Unknown argument";
  }
};

export const getNotificationContent = (notification, username) => {
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
