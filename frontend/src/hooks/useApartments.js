import useGetRequest from "./useGetRequest";
import usePostRequest from "./usePostRequest";
import usePatchRequest from "./usePatchRequest";

const getBaseUrl = (username) => {
  return `/user/${username}/apartments`;
};

export const useUserApartments = () => {
  const fetchData = useGetRequest();

  const fetchUserApartments = async (username) => {
    const url = getBaseUrl(username);
    return fetchData(url);
  };
  return fetchUserApartments;
};

export const useUserApartmentById = () => {
  const fetchData = useGetRequest();

  const fetchUserApartmentById = async (username, id) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}`;
    return fetchData(url);
  };
  return fetchUserApartmentById;
};

export const useUserApartmentsByStatus = () => {
  const fetchData = useGetRequest();

  const fetchUserApartmentsByStatus = async (username, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/status?status=${status}`;
    return fetchData(url);
  };
  return fetchUserApartmentsByStatus;
};

export const useIsUserApartmentByIdRented = () => {
  const fetchData = useGetRequest();

  const fetchIsUserApartmentRented = async (username, id) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}/rented`;
    return fetchData(url);
  };
  return fetchIsUserApartmentRented;
};

export const useUserApartment = () => {
  const postData = usePostRequest();

  const postUserApartment = async (username, payload) => {
    const url = getBaseUrl(username);
    console.log("url:", url);
    console.log("payload:", payload);
    return postData(url, payload);
  };
  return postUserApartment;
};

export const useUserApartmentEquipment = () => {
  const postData = usePostRequest();

  const postUserApartmentEquipment = async (username, id, payload) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}/equipments`;
    console.log("url:", url);
    console.log("payload:", payload);
    return postData(url, payload);
  };
  return postUserApartmentEquipment;
};

export const usePatchApartmentEquipmentStatus = () => {
  const patchData = usePatchRequest();

  const patchUserEquipmentStatus = async (username, aid, eid, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${aid}/equipments/${eid}`;
    return patchData(url, status);
  };
  return patchUserEquipmentStatus;
};
