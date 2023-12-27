import { useState, useEffect } from "react";

import useData from "../../hooks/useData";

import DashboardApartments from "../../components/owner/DashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";

import DashboardSkeleton from "../../components/common/skeletons/DashboardSkeleton";

import { Box } from "@mui/material";

const OwnerDashboard = () => {
  const { isOwner, isClient, isDataFetched, apartments } = useData();
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
    <Box sx={{ flexGrow: 1 }}>
      {isDataFetched && isOwner && (
        <>
          <SectionHeader title="Rented Apartments" />
          <DashboardApartments apartments={rentedApartments} />
          <SectionHeader title="Vacant Apartments" />
          <DashboardApartments apartments={vacantApartments} />
        </>
      )}
      {isDataFetched && isClient && (
        <>
          <SectionHeader title="Rented Apartment" />
          <DashboardApartments apartments={rentedApartments} />
        </>
      )}
      {!isDataFetched && <DashboardSkeleton />}
    </Box>
  );
};

export default OwnerDashboard;
