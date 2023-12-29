import useGetRequest from "./useGetRequest";
import usePostRequest from "./usePostRequest";
import usePatchRequest from "./usePatchRequest";
import useDeleteRequest from "./useDeleteRequest";

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
    return postData(url, payload);
  };
  return postUserApartment;
};

export const usePostEquipment = () => {
  const postData = usePostRequest();

  const postEquipment = async (username, id, payload) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}/equipments`;
    return postData(url, payload);
  };
  return postEquipment;
};

export const usePatchEquipmentStatus = () => {
  const patchData = usePatchRequest();

  const patchEquipmentStatus = async (username, aid, eid, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${aid}/equipments/${eid}`;
    return patchData(url, status);
  };
  return patchEquipmentStatus;
};

export const useDeleteEquipment = () => {
  const deleteData = useDeleteRequest();

  const deleteEquipment = async (username, aid, eid) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${aid}/equipments/${eid}`;
    return deleteData(url);
  };
  return deleteEquipment;
};

export const useDeleteApartment = () => {
  const deleteData = useDeleteRequest();

  const deleteApartment = async (username, aid) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${aid}`;
    return deleteData(url);
  };
  return deleteApartment;
};
