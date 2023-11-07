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
    case "apartment_created":
      return "Apartment Created";
    default:
      return "Nieznany argument";
  }
};

export const getNotificationContent = (notification) => {
  switch (notification?.notificationType) {
    case "equipment_added":
      return "New Equipment Addedsfdghdsfgfdsf dsjhdfsjbdvsn bjsdjbsdjbnksaknjd saknjdsank jdsajkndsa sdfjsdfjhfsdjfds  sdfyasduyi adsjhsdajhasdjh adsjhdasjh dasjdsajdash dsjdasjhdsa dasjdashj";
    case "equipment_failure":
      return "Equipment Failure Reported";
    case "equipment_fix":
      return "Equipment Fix Reported";
    default:
      return "Nieznany argument";
  }
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
