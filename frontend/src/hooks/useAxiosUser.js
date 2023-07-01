import { axiosUser } from "../services/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosUser = () => {
  const refreshToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const responseIntercept = axiosUser.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log("responseIntercept");
        const prevRequest = err?.config;
        console.log(!prevRequest.sent);
        if (err?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          await refreshToken();
          console.log("New Access Token");
          return axiosUser(prevRequest);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosUser.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshToken]);

  return axiosUser;
};

export default useAxiosUser;
