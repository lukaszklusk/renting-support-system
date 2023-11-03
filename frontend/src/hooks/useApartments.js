import useGetRequest from "./useGetRequest";

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
