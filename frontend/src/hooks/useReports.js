import useGetRequest from "./useGetRequest";

const getBaseUrl = (username) => {
  return `/user/${username}/report`;
};

export const useUserOverviewReport = () => {
  const getData = useGetRequest();

  const getUserOverviewReport = async (username) => {
    const url = `${getBaseUrl(username)}/overview`;
    console.log("url:", url);
    return getData(url, { responseType: "blob" });
  };
  return getUserOverviewReport;
};

export const useUserSimpleReport = () => {
  const getData = useGetRequest();

  const getUserSimpleReport = async (username) => {
    const url = `${getBaseUrl(username)}/simple`;
    console.log("url:", url);
    return getData(url, { responseType: "blob" });
  };
  return getUserSimpleReport;
};

export const useUserDetailedReport = () => {
  const getData = useGetRequest();

  const getUserDetailedReport = async (username) => {
    const url = `${getBaseUrl(username)}/detailed`;
    console.log("url:", url);
    return getData(url, { responseType: "blob" });
  };
  return getUserDetailedReport;
};
