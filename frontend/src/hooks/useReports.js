import useGetRequest from "./useGetRequest";

const getBaseUrl = (username) => {
  return `/user/${username}/report`;
};

export const useUserReport = () => {
  const getData = useGetRequest();

  const getUserReport = async (username) => {
    const url = getBaseUrl(username);
    console.log("url:", url);
    return getData(url);
  };
  return getUserReport;
};
