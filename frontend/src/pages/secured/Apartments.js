import { useState, useEffect } from "react";

import useData from "../../hooks/useData";

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerApartmentsList from "../../components/owner/ApartmentsList";

const OwnerApartments = () => {
  const { isOwner, isDataFetched, apartments } = useData();

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
      {isDataFetched && isOwner ? (
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
        <span></span>
      )}
      {isDataFetched && !isOwner ? (
        <>
          <SectionHeader title="Rented Apartment" />
          <OwnerApartmentsList apartments={rentedApartments} />
        </>
      ) : (
        <span></span>
      )}
      {!isDataFetched ? <p>Loading</p> : <span></span>}
    </section>
  );
};

export default OwnerApartments;
