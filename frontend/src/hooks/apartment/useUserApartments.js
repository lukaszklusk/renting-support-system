import useGetRequest from "../useGetRequest";

const useUserApartments = () => {
  const fetchData = useGetRequest();

  const fetchUserApartments = async (username) => {
    const url = `/user/${username}/apartment`;
    return fetchData(url);
  };
  return fetchUserApartments;
};

export default useUserApartments;
