import { useState, useEffect } from "react";

import useData from "../../hooks/useData";

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerApartmentsList from "../../components/owner/OwnerApartmentsList";

const OwnerApartments = () => {
  const { isDataFetched, apartments } = useData();

  const [rentedApartments, setRentedApartments] = useState([]);
  const [vacantApartments, setVacantApartments] = useState([]);

  useEffect(() => {
    setRentedApartments(
      apartments?.filter((apartment) => apartment.tenant != null)
    );
    setVacantApartments(
      apartments?.filter((apartment) => apartment.tenant == null)
    );
  }, [apartments]);

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
