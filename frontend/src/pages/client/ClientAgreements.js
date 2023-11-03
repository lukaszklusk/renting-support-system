import { useState, useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerAgreementsList from "../../components/owner/OwnerAgreementsList";

import { useUserAgreementsByStatus } from "../../hooks/useAgreements";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function ClientAgreements() {
  const [activeAgreements, setActiveAgreements] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState(null);
  const [rejectedAgreements, setRejectedAgreements] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { auth } = useAuth();
  const fetchUserAgreementsByStatus = useUserAgreementsByStatus();

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const activeAgreements = await fetchUserAgreementsByStatus(
          username,
          "accepted"
        );
        const proposedAgreements = await fetchUserAgreementsByStatus(
          username,
          "proposed"
        );

        const rejectedAgreements = await fetchUserAgreementsByStatus(
          username,
          "rejected"
        );

        setActiveAgreements(activeAgreements);
        setProposedAgreements(proposedAgreements);
        setRejectedAgreements(rejectedAgreements);
        setIsDataFetched(true);
      };
      fetchData();
    }
  }, []);

  return (
    <section>
      {isDataFetched ? (
        <>
          <SectionHeader title="Active Agreements" />
          <OwnerAgreementsList agreements={activeAgreements} />
          <SectionHeader title="Proposed Agreements" />
          <OwnerAgreementsList
            agreements={proposedAgreements}
            isProposed={true}
          />
          <SectionHeader title="Rejected Agreements" />
          <OwnerAgreementsList agreements={rejectedAgreements} />
          {/* <SectionHeader title="Propose New Agreement" as={Link} to="/new" /> */}
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
}

export default ClientAgreements;
