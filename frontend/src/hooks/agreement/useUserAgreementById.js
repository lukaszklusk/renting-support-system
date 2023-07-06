import useGetRequest from "../useGetRequest";

const useUserAgreementById = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementById = async (username, id) => {
    const url = `/user/${username}/agreement/${id}`;
    return fetchData(url);
  };
  return fetchUserAgreementById;
};

export default useUserAgreementById;
