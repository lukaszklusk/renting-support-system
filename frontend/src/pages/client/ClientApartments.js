import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import SectionHeader from "../../components/common/SectionHeader";
import { useUserApartments } from "../../hooks/useApartments";
import OwnerApartmentsList from "../../components/owner/OwnerApartmentsList";

const ClientApartments = () => {
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
          <OwnerApartmentsList apartments={apartment} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default ClientApartments;
