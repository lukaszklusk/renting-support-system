import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import SectionHeader from "../../components/common/SectionHeader";
import useUserApartmentsByStatus from "../../hooks/apartment/useUserApartmentsByStatus";
import OwnerApartmentsList from "../../components/owner/OwnerApartmentsList";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const OwnerApartments = () => {
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
          <OwnerApartmentsList apartments={rentedApartments} />
          <SectionHeader title="Vacant Apartments" />
          <OwnerApartmentsList apartments={vacantApartments} />
          <Button as={Link} to="new" variant="outline-dark">
            Add New Apartment
          </Button>
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default OwnerApartments;
