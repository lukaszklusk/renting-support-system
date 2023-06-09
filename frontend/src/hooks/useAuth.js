import { useContext } from "react";
import AuthContext from "../components/auth/AuthProvider";

const useAuth = () => {
  console.log("Auth:", useContext(AuthContext));
  return useContext(AuthContext);
};

export default useAuth;
