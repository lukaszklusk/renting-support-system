import React, { useState, useEffect, Suspense } from "react";

import useData from "../../hooks/useData";

import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";

import Apartment from "../../components/common/Apartment";

import { Box, SpeedDial, SpeedDialIcon, Tab, Tabs } from "@mui/material";

import ApartmentsSkeleton from "../../components/common/skeletons/ApartmentsSkeleton";

const OwnerApartments = () => {
  const { isClient, isOwner, isDataFetched, apartments } = useData();

  const [activeTab, setActiveTab] = useState(0);

  const [rentedApartments, setRentedApartments] = useState([]);
  const [vacantApartments, setVacantApartments] = useState([]);

  const LazyItemsList = React.lazy(() =>
    import("../../components/common/ItemsList")
  );

  const handleActiveTabChange = (event, newActiveTab) => {
    setActiveTab(newActiveTab);
  };

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
      <Suspense fallback={<ApartmentsSkeleton />}>
        {isDataFetched && isOwner && (
          <>
            <Tabs value={activeTab} onChange={handleActiveTabChange} centered>
              <Tab label="Rented" />
              <Tab label="Vacant" />
            </Tabs>

            {activeTab === 0 && (
              <>
                {rentedApartments?.length > 0 ? (
                  <LazyItemsList items={rentedApartments} ItemUI={Apartment} />
                ) : (
                  <SectionHeader title="No Rented Apartments" />
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {vacantApartments?.length > 0 ? (
                  <LazyItemsList
                    items={vacantApartments}
                    ItemUI={Apartment}
                    itemProps={{ toShowDeleteButton: true }}
                  />
                ) : (
                  <SectionHeader title="No Vacant Apartments" />
                )}
              </>
            )}

            <Link to="new">
              <SpeedDial
                ariaLabel="New Apartment"
                sx={{
                  position: "fixed",
                  bottom: 40,
                  right: 40,
                }}
                icon={<SpeedDialIcon />}
                open={false}
                FabProps={{
                  sx: {
                    bgcolor: "green",
                    "&:hover": {
                      bgcolor: "green",
                    },
                  },
                }}
              />
            </Link>
          </>
        )}

        {isDataFetched && isClient && (
          <>
            {rentedApartments?.length > 0 ? (
              <>
                <SectionHeader title="Rented Apartments" />
                <LazyItemsList items={rentedApartments} ItemUI={Apartment} />
              </>
            ) : (
              <SectionHeader title="No Rented Apartments" />
            )}
          </>
        )}
        {!isDataFetched && <ApartmentsSkeleton />}
      </Suspense>
    </Box>
  );
};

export default OwnerApartments;
