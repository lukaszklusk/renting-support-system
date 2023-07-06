import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import OwnerDashboardApartments from "../../components/owner/OwnerDashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";
import useUserApartments from "../../hooks/apartment/useUserApartments";

const OwnerDashboard = () => {
  const [apartment, setApartment] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { auth } = useAuth();
  const fetchUserApartments = useUserApartments();

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const apartment = await fetchUserApartments(username);
        setApartment(apartment);
        setIsDataFetched(true);
      };

      fetchData();
    }
  }, []);

  return (
    <section>
      {isDataFetched ? (
        <>
          <SectionHeader title="Rented Apartment" />
          <OwnerDashboardApartments apartments={apartment} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default OwnerDashboard;
