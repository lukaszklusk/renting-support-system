import { useState, useEffect } from "react";

import useData from "../../hooks/useData";

import OwnerDashboardApartments from "../../components/owner/OwnerDashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";

const OwnerDashboard = () => {
  const { isOwner, isDataFetched, apartments } = useData();
  const [rentedApartments, setRentedApartments] = useState(null);
  const [vacantApartments, setVacantApartments] = useState(null);

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
          <OwnerDashboardApartments apartments={rentedApartments} />
          <SectionHeader title="Vacant Apartments" />
          <OwnerDashboardApartments apartments={vacantApartments} />
        </>
      ) : (
        <span></span>
      )}
      {isDataFetched && !isOwner ? (
        <>
          <SectionHeader title="Rented Apartment" />
          <OwnerDashboardApartments apartments={rentedApartments} />
        </>
      ) : (
        <span></span>
      )}
      {!isDataFetched ? <p>Loading</p> : <span></span>}
    </section>
  );
};

export default OwnerDashboard;
