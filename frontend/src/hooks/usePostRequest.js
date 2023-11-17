import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const usePostRequest = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const postData = async (url, payload) => {
    try {
      const response = await axiosUser.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.log("error posting data", err);
      // navigate("/sign-in", {
      //   state: { from: location },
      //   replace: true,
      // });
      throw err;
    }
  };
  return postData;
};

export default usePostRequest;
