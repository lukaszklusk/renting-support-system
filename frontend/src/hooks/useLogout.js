import { useNavigate } from "react-router-dom";
import axios from "../services/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    console.log("trying logging out");
    if (auth?.isLoggedIn) {
      try {
        console.log("starting logging out");
        await axios.post("/sign-out");
        setAuth({ isLoggedIn: false });
        navigate("/sign-in");
      } catch (err) {
        console.error("Signing out failed:", err);
        throw err;
      }
    }
  };

  return logout;
};

export default useLogout;
