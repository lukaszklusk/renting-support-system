import { useParams, Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import useUserAgreementById from "../../hooks/agreement/useUserAgreementById";
import useAuth from "../../hooks/useAuth";
import ListGroup from "react-bootstrap/ListGroup";

const OwnerAgreementDetails = () => {
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const fetchUserAgreementById = useUserAgreementById();
  const { auth } = useAuth();

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
              <ListGroup.Item>
                <strong> Tenant: </strong> {agreement.tenant.firstName}{" "}
                {agreement.tenant.lastName} ({agreement.tenant.username})
              </ListGroup.Item>
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
