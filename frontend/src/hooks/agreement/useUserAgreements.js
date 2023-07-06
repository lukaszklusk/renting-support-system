import useGetRequest from "../useGetRequest";

const useUserAgreements = () => {
  const fetchData = useGetRequest();

  const fetchUserAgreements = async (username) => {
    const url = `/user/${username}/agreement`;
    return fetchData(url);
  };
  return fetchUserAgreements;
};

export default useUserAgreements;
