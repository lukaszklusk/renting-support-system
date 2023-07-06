import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import OwnerDashboardApartments from "../../components/owner/OwnerDashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";
import useUserApartmentsByStatus from "../../hooks/apartment/useUserApartmentsByStatus";

const OwnerDashboard = () => {
  const [rentedApartments, setRentedApartments] = useState(null);
  const [vacantApartments, setVanantApartments] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { auth } = useAuth();
  const fetchApartmentsByStatus = useUserApartmentsByStatus();

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const rented = await fetchApartmentsByStatus(username, "rented");
        const vacant = await fetchApartmentsByStatus(username, "vacant");
        setRentedApartments(rented);
        setVanantApartments(vacant);
        setIsDataFetched(true);
      };

      fetchData();
    }
  }, []);

  return (
    <section>
      {isDataFetched ? (
        <>
          <SectionHeader title="Rented Apartments" />
          <OwnerDashboardApartments apartments={rentedApartments} />
          <SectionHeader title="Vacant Apartments" />
          <OwnerDashboardApartments apartments={vacantApartments} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default OwnerDashboard;
