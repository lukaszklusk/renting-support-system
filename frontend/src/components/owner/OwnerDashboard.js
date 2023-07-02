import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "../../hooks/useAxiosUser";
import OwnerDashboardApartments from "./OwnerDashboardApartments";

const OwnerDashboard = () => {
  const [text, setText] = useState("");
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let isRequestCompleted = false;
    const controller = new AbortController();

    const getDemo = async () => {
      try {
        const response = await axiosUser.get("/demo", {
          signal: controller.signal,
        });
        console.log(response.data);
        if (isMounted && !isRequestCompleted && setText) {
          setText(response.data);
        }
      } catch (err) {
        console.log(err);
        navigate("/sign-in", {
          state: { from: location },
          replace: true,
        });
      } finally {
        isRequestCompleted = true;
      }
    };

    getDemo();

    // return () => {
    //   isMounted = false;
    //   if (!isRequestCompleted) {
    //     console.log("aborted");
    //     controller.abort();
    //   }
    // };
  }, []);

  return (
    <div>
      <OwnerDashboardApartments />
    </div>
  );
};

export default OwnerDashboard;
