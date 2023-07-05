import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const useApartmentAgreements = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApartmentAgreements = async (username, id) => {
    try {
      const url = `/user/${username}/apartment/${id}/agreement`;
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
  return fetchApartmentAgreements;
};

export default useApartmentAgreements;
