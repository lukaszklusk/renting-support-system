import useGetRequest from "../useGetRequest";

const useUserAgreementsByApartmentId = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementsByApartmentId = async (username, id) => {
    const url = `/user/${username}/apartment/${id}/agreement`;
    return fetchData(url);
  };
  return fetchUserAgreementsByApartmentId;
};

export default useUserAgreementsByApartmentId;
