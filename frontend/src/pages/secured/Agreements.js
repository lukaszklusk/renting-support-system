import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";

import useData from "../../hooks/useData";

import SectionHeader from "../../components/common/SectionHeader";
import Agreement from "../../components/common/Agreement";

import { Link } from "react-router-dom";

import { Box, SpeedDial, SpeedDialIcon, Tab, Tabs } from "@mui/material";
import AgreementsSkeleton from "../../components/common/skeletons/AgreementsSkeleton";

function Agreements() {
  const { isClient, isOwner, isDataFetched, agreements } = useData();

  const [activeTab, setActiveTab] = useState(0);

  const [activeAgreements, setActiveAgreements] = useState([]);
  const [acceptedAgreements, setAcceptedAgreements] = useState();
  const [proposedAgreements, setProposedAgreements] = useState([]);
  const [finishedAgreements, setFinishedAgreements] = useState([]);
  const [rejectedOwnerAgreements, setRejectedOwnerAgreements] = useState([]);
  const [rejectedClientAgreements, setRejectedClientAgreements] = useState([]);
  const [cancelledOwnerAgreements, setCancelledOwnerAgreements] = useState([]);
  const [cancelledClientAgreements, setCancelledClientAgreements] = useState(
    []
  );
  const [withdrawnOwnerAgreements, setWithdrawnOwnerAgreements] = useState([]);
  const [withdrawnClientAgreements, setWithdrawnClientAgreements] = useState(
    []
  );

  const { apartmentId } = useParams();

  const LazyItemsList = React.lazy(() =>
    import("../../components/common/ItemsList")
  );

  const handleActiveTabChange = (event, newActiveTab) => {
    setActiveTab(newActiveTab);
  };

  useEffect(() => {
    setActiveAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "active")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setAcceptedAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "accepted")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setProposedAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "proposed")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setRejectedOwnerAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "rejected_owner")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setRejectedClientAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "rejected_client")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setCancelledOwnerAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "cancelled_owner")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setCancelledClientAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "cancelled_client")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setWithdrawnOwnerAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "withdrawn_owner")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setWithdrawnClientAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "withdrawn_client")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );

    setFinishedAgreements(
      agreements
        .filter((agreement) => agreement.agreementStatus === "finished")
        .filter(
          (agreement) =>
            !parseInt(apartmentId) ||
            agreement.apartmentId === parseInt(apartmentId)
        )
    );
  }, [agreements, apartmentId]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Suspense fallback={<AgreementsSkeleton />}>
        <Tabs value={activeTab} onChange={handleActiveTabChange} centered>
          <Tab label="Present" />
          <Tab label="Past" />
        </Tabs>

        {isDataFetched && isOwner && (
          <>
            {activeTab === 0 && (
              <>
                {activeAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Active" />
                    <LazyItemsList
                      items={activeAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toCancel: true }}
                    />
                  </>
                )}

                {acceptedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Accepted By Client" />
                    <LazyItemsList
                      items={acceptedAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toResponse: true }}
                    />
                  </>
                )}

                {proposedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Proposed By You" />
                    <LazyItemsList
                      items={proposedAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toWithdrawn: true }}
                    />
                  </>
                )}

                {activeAgreements?.length === 0 &&
                  acceptedAgreements?.length === 0 &&
                  proposedAgreements?.length === 0 && (
                    <SectionHeader title="No Present Agreements" />
                  )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {finishedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Finished Agreements" />
                    <LazyItemsList
                      items={finishedAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {cancelledOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Cancelled By You" />
                    <LazyItemsList
                      items={cancelledOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {cancelledClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Cancelled By Client" />
                    <LazyItemsList
                      items={cancelledClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {rejectedOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Rejected By You" />
                    <LazyItemsList
                      items={rejectedOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {rejectedClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Rejected By Client" />
                    <LazyItemsList
                      items={rejectedClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {withdrawnOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Withdrawn By You" />
                    <LazyItemsList
                      items={withdrawnOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {withdrawnClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Withdrawn By Client" />
                    <LazyItemsList
                      items={withdrawnClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {finishedAgreements?.length === 0 &&
                  cancelledOwnerAgreements?.length === 0 &&
                  cancelledClientAgreements?.length === 0 &&
                  rejectedOwnerAgreements?.length === 0 &&
                  rejectedClientAgreements?.length === 0 &&
                  withdrawnOwnerAgreements?.length === 0 &&
                  withdrawnClientAgreements?.length === 0 && (
                    <SectionHeader title="No Past Agreements" />
                  )}
              </>
            )}

            {!parseInt(apartmentId) && (
              <Link to="new">
                <SpeedDial
                  ariaLabel="New Agreement"
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
            )}
          </>
        )}

        {isDataFetched && isClient && (
          <>
            {activeTab === 0 && (
              <>
                {activeAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Active" />
                    <LazyItemsList
                      items={activeAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toCancel: true }}
                    />
                  </>
                )}

                {acceptedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Accepted By You" />
                    <LazyItemsList
                      items={acceptedAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toWithdrawn: true }}
                    />
                  </>
                )}

                {proposedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Proposed By Owner" />
                    <LazyItemsList
                      items={proposedAgreements}
                      ItemUI={Agreement}
                      itemProps={{ isPresent: true, toResponse: true }}
                    />
                  </>
                )}

                {activeAgreements?.length === 0 &&
                  acceptedAgreements?.length === 0 &&
                  proposedAgreements?.length === 0 && (
                    <SectionHeader title="No Present Agreements" />
                  )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {finishedAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Finished Agreements" />
                    <LazyItemsList
                      items={finishedAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {cancelledOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Cancelled By Owner" />
                    <LazyItemsList
                      items={cancelledOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {cancelledClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Cancelled By You" />
                    <LazyItemsList
                      items={cancelledClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {rejectedOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Rejected By Owner" />
                    <LazyItemsList
                      items={rejectedOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {rejectedClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Rejected By You" />
                    <LazyItemsList
                      items={rejectedClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {withdrawnOwnerAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Withdrawn By Owner" />
                    <LazyItemsList
                      items={withdrawnOwnerAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {withdrawnClientAgreements?.length > 0 && (
                  <>
                    <SectionHeader title="Withdrawn By You" />
                    <LazyItemsList
                      items={withdrawnClientAgreements}
                      ItemUI={Agreement}
                    />
                  </>
                )}

                {finishedAgreements?.length === 0 &&
                  cancelledOwnerAgreements?.length === 0 &&
                  cancelledClientAgreements?.length === 0 &&
                  rejectedOwnerAgreements?.length === 0 &&
                  rejectedClientAgreements?.length === 0 &&
                  withdrawnOwnerAgreements?.length === 0 &&
                  withdrawnClientAgreements?.length === 0 && (
                    <SectionHeader title="No Past Agreements" />
                  )}
              </>
            )}
          </>
        )}

        {!isDataFetched && <AgreementsSkeleton />}
      </Suspense>
    </Box>
  );
}

export default Agreements;
