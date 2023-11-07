import { useState, useEffect } from "react";

import useData from "../../hooks/useData";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerAgreementsList from "../../components/owner/OwnerAgreementsList";

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function OwnerAgreements() {
  const { isOwner, isDataFetched, agreements } = useData();

  const [activeAgreements, setActiveAgreements] = useState(null);
  const [acceptedAgreements, setAcceptedAgreements] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState(null);

  useEffect(() => {
    setActiveAgreements(
      agreements?.filter((agreement) => agreement.agreementStatus == "active")
    );
    setAcceptedAgreements(
      agreements?.filter((agreement) => agreement.agreementStatus == "accepted")
    );
    setProposedAgreements(
      agreements?.filter((agreement) => agreement.agreementStatus == "proposed")
    );
  }, [agreements]);

  return (
    <section>
      {isDataFetched && isOwner ? (
        <>
          <SectionHeader title="Active Agreements" />
          <OwnerAgreementsList agreements={activeAgreements} />
          <SectionHeader title="Accepted Agreements" />
          <OwnerAgreementsList
            agreements={acceptedAgreements}
            isProposed={true}
          />
          {/* <OwnerAgreementsList agreements={[...activeAgreements, acceptedAgreements]} /> */}
          <SectionHeader title="Proposed Agreements" />
          <OwnerAgreementsList agreements={proposedAgreements} />

          <Button as={Link} to="new" variant="outline-dark">
            Propose New Agreement
          </Button>
          {/* <SectionHeader title="Propose New Agreement" as={Link} to="/new" /> */}
        </>
      ) : (
        <span></span>
      )}
      {isDataFetched && !isOwner ? (
        <>
          <SectionHeader title="Active Agreement" />
          <OwnerAgreementsList agreements={activeAgreements} />
          <SectionHeader title="Accepted Agreements" />
          <OwnerAgreementsList agreements={acceptedAgreements} />
          <SectionHeader title="Proposed Agreements" />
          <OwnerAgreementsList
            agreements={proposedAgreements}
            isProposed={true}
          />
        </>
      ) : (
        <span></span>
      )}
      {!isDataFetched ? <p>Loading</p> : <span></span>}
    </section>
  );
}

export default OwnerAgreements;
