import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

const usePatchRequest = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const patchData = async (url, args) => {
    try {
      console.log("patchData", url, args);
      const response = await axiosUser.patch(url, null, { params: args });
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
  return patchData;
};

export default usePatchRequest;
