import { useState, useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerAgreementsList from "../../components/owner/OwnerAgreementsList";

import useUserAgreementsByStatus from "../../hooks/agreement/useUserAgreementsByStatus";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function OwnerAgreements() {
  const [activeAgreements, setActiveAgreements] = useState(null);
  const [acceptedAgreements, setAcceptedAgreements] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { auth } = useAuth();
  const fetchUserAgreementsByStatus = useUserAgreementsByStatus();

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const activeAgreements = await fetchUserAgreementsByStatus(
          username,
          "active"
        );
        const acceptedAgreements = await fetchUserAgreementsByStatus(
          username,
          "accepted"
        );
        const proposedAgreements = await fetchUserAgreementsByStatus(
          username,
          "proposed"
        );

        console.log("acceptedAgreements", acceptedAgreements);

        setActiveAgreements(activeAgreements);
        setProposedAgreements(proposedAgreements);
        setAcceptedAgreements(acceptedAgreements);
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
          <SectionHeader title="Accepted Agreements" />
          <OwnerAgreementsList agreements={acceptedAgreements} />
          {/* <OwnerAgreementsList agreements={[...activeAgreements, acceptedAgreements]} /> */}
          <SectionHeader title="Proposed Agreements" />
          <OwnerAgreementsList agreements={proposedAgreements} />

          <Button as={Link} to="new" variant="outline-dark">
            Propose New Agreement
          </Button>
          {/* <SectionHeader title="Propose New Agreement" as={Link} to="/new" /> */}
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
}

export default OwnerAgreements;
