import { useState, useEffect } from "react";

import useData from "../../hooks/useData";

import OwnerDashboardApartments from "../../components/owner/OwnerDashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";

const OwnerDashboard = () => {
  const { isDataFetched, apartments } = useData();
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
