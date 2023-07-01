import axios from "../services/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refreshToken = async () => {
    await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev };
    });
  };

  return refreshToken;
};

export default useRefreshToken;
