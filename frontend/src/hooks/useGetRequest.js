import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useGetRequest = () => {
  const axiosUser = useAxiosUser();

  const fetchData = async (url, customOptions = {}) => {
    try {
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const mergeOptions = { ...defaultOptions, ...customOptions };
      const response = await axiosUser.get(url, mergeOptions);
      return response.data;
    } catch (err) {
      // navigate("/sign-in", {
      //   state: { from: location },
      //   replace: true,
      // });
      throw err;
    }
  };
  return fetchData;
};

export default useGetRequest;
