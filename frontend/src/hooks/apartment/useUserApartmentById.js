import useGetRequest from "../useGetRequest";

const useUserApartmentById = () => {
  const fetchData = useGetRequest();

  const fetchUserApartmentById = async (username, id) => {
    const url = `/user/${username}/apartment/${id}`;
    return fetchData(url);
  };
  return fetchUserApartmentById;
};

export default useUserApartmentById;
