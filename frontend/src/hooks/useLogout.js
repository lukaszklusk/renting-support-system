import { useNavigate } from "react-router-dom";
import axios from "../services/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    if (auth?.isLoggedIn) {
      try {
        await axios.post("/sign-out");
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
