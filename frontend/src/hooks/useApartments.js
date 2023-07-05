import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useApartments = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApartments = async (username, id = null) => {
    try {
      const url = id
        ? `/user/${username}/apartment/${id}`
        : `/user/${username}/apartment`;
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
  return fetchApartments;
};

export default useApartments;
