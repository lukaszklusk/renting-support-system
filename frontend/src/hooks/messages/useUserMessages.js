import useGetRequest from "../useGetRequest";

const useUserMessages = () => {
  const fetchData = useGetRequest();

  const fetchUserMessages = async (username) => {
    const url = `user/${username}/messages`;
    return fetchData(url);
  };
  return fetchUserMessages;
};

export default useUserMessages;
