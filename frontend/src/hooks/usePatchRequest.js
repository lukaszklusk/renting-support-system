import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const usePatchRequest = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const patchData = async (url, args) => {
    try {
      const response = await axiosUser.patch(url, null, { params: args });
      return response.data;
    } catch (err) {
      // navigate("/sign-in", {
      //   state: { from: location },
      //   replace: true,
      // });
      throw err;
    }
  };
  return patchData;
};

export default usePatchRequest;
