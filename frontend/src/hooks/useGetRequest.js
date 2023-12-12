import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useGetRequest = () => {
  const axiosUser = useAxiosUser();

  const fetchData = async (url) => {
    try {
      const response = await axiosUser.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.log("error fetching data", err);
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
