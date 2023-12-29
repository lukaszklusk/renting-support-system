import useGetRequest from "./useGetRequest";
import usePatchRequest from "./usePatchRequest";
import usePostRequest from "./usePostRequest";

const getBaseUrl = (username) => {
  return `/user/${username}/agreements`;
};

export const useUserAgreement = () => {
  const postData = usePostRequest();

  const postUserAgreement = async (username, payload) => {
    const url = getBaseUrl(username);
    console.log("url:", url);
    console.log("payload:", payload);
    return postData(url, payload);
  };
  return postUserAgreement;
};

export const useUserAgreements = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreements = async (username) => {
    const url = getBaseUrl(username);
    return fetchData(url);
  };
  return fetchUserAgreements;
};

export const useUserAgreementById = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementById = async (username, id) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}`;
    return fetchData(url);
  };
  return fetchUserAgreementById;
};

export const useUserAgreementsByStatus = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementsByStatus = async (username, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/status/${status}`;
    return fetchData(url);
  };
  return fetchUserAgreementsByStatus;
};

export const useUserAgreementsByApartmentId = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementsByApartmentId = async (username, apartmentId) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${apartmentId}/agreements`;
    return fetchData(url);
  };
  return fetchUserAgreementsByApartmentId;
};

export const usePatchUserAgreementStatus = () => {
  const patchData = usePatchRequest();

  const patchUserAgreementStatus = async (username, id, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}`;
    return patchData(url, status);
  };
  return patchUserAgreementStatus;
};

export const epochDaysToStringDate = (epochDays) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const date = new Date(
    epochDays * millisecondsPerDay + new Date().getTimezoneOffset() * 60 * 1000
  );
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};
