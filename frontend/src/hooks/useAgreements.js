import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useAgreements = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAgreements = async (username, id = null) => {
    try {
      const url = id
        ? `/user/${username}/agreement/${id}`
        : `/user/${username}/agreement`;
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
  return fetchAgreements;
};

export default useAgreements;
