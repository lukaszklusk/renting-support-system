import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useGetRequest = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (url) => {
    try {
      const response = await axiosUser.get(url);
      console.log(response.data);
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
  return fetchData;
};

export default useGetRequest;
