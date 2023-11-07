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
      // TODO
      console.log(err);
      navigate("/sign-in", {
        state: { from: location },
        replace: true,
      });
    }
  };
  return postData;
};

export default usePostRequest;
