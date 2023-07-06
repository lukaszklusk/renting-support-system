import useGetRequest from "../useGetRequest";

const useUserAgreementsByStatus = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreementsByStatus = async (username, status) => {
    const url = `/user/${username}/agreement/status/${status}`;
    return fetchData(url);
  };
  return fetchUserAgreementsByStatus;
};

export default useUserAgreementsByStatus;
