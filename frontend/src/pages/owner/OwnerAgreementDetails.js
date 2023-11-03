import { useParams, Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { useUserAgreementById } from "../../hooks/useAgreements";
import useAuth from "../../hooks/useAuth";
import ListGroup from "react-bootstrap/ListGroup";
import { ROLES } from "../../config/roles";

const OwnerAgreementDetails = () => {
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const fetchUserAgreementById = useUserAgreementById();
  const { auth } = useAuth();

  const isLoggedIn = auth.isLoggedIn;
  const isClient = isLoggedIn && auth?.roles?.includes(ROLES.client);
  const isOwner = isLoggedIn && auth?.roles?.includes(ROLES.owner);
  const isAdmin = isLoggedIn && auth?.roles?.includes(ROLES.admin);

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const agreement = await fetchUserAgreementById(username, id);
        setAgreement(agreement);
        setIsDataFetched(true);
      };
      fetchData();
    }
  }, []);

  return (
    <section>
      {isDataFetched ? (
        <>
          <SectionHeader title="Agreement Details" />
          <Card className="mb-3 mx-4">
            <Card.Header>
              <Card.Link as={Link} to={`/apartments/${agreement.apartment.id}`}>
                {agreement.name}
              </Card.Link>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {" "}
                <strong>Status:</strong> {agreement.agreementStatus}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Apartment:</strong> {agreement.apartment.name}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> Rent: </strong>{" "}
                {(
                  agreement.administrationFee + agreement.monthlyPayment
                ).toFixed(2)}
              </ListGroup.Item>
              {isOwner ? (
                <>
                  <ListGroup.Item>
                    {" "}
                    <strong>Tenant:</strong> {agreement.tenant.firstName}{" "}
                    {agreement.tenant.lastName} ({agreement.tenant.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <strong>Contact:</strong> {agreement.tenant.phoneNumber}
                  </ListGroup.Item>{" "}
                </>
              ) : (
                <>
                  <ListGroup.Item>
                    {" "}
                    <strong>Tenant:</strong> {agreement.owner.firstName}{" "}
                    {agreement.owner.lastName} ({agreement.owner.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <strong>Contact:</strong> {agreement.owner.phoneNumber}
                  </ListGroup.Item>{" "}
                </>
              )}
              <ListGroup.Item>
                <strong> Duration: </strong> {agreement.signingDate} :{" "}
                {agreement.expirationDate}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default OwnerAgreementDetails;
