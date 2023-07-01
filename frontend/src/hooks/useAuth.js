import { useContext } from "react";
import AuthContext from "../components/common/auth/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
