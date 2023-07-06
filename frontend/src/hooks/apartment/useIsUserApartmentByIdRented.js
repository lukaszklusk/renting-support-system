import useGetRequest from "../useGetRequest";

const useIsUserApartmentByIdRented = () => {
  const fetchData = useGetRequest();

  const fetchIsUserApartmentRented = async (username, id) => {
    const url = `/user/${username}/apartment/${id}/rented`;
    return fetchData(url);
  };
  return fetchIsUserApartmentRented;
};

export default useIsUserApartmentByIdRented;
