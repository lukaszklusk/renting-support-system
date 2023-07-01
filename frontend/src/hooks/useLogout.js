import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";
import useAuth from "./useAuth";

const useLogout = () => {
  const navigate = useNavigate();
  const axiosUser = useAxiosUser();
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    if (auth.isLoggedIn) {
      try {
        const response = await axiosUser.post("/sign-out");
        setAuth({ isLoggedIn: false });
        navigate("/sign-in");
      } catch (error) {
        console.error("Signing out failed:", error);
      }
    }
  };

  return logout;
};

export default useLogout;
