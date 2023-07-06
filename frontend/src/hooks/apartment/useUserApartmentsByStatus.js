import useGetRequest from "../useGetRequest";

const useUserApartmentsByStatus = () => {
  const fetchData = useGetRequest();

  const fetchUserApartmentsByStatus = async (username, status) => {
    const url = `/user/${username}/apartment/status?status=${status}`;
    return fetchData(url);
  };
  return fetchUserApartmentsByStatus;
};

export default useUserApartmentsByStatus;
