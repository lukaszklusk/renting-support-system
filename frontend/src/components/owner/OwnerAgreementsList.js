import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ROLES } from "../../config/roles";
import useAuth from "../../hooks/useAuth";
import { Button } from "react-bootstrap";
import usePatchUserAgreementStatus from "../../hooks/agreement/usePatchUserAgreementStatus";

function OwnerAgreementsList({ agreements, isProposed }) {
  const { auth } = useAuth();
  const username = auth.username;
  const fetchPatchUserAgreementStatus = usePatchUserAgreementStatus();

  const isLoggedIn = auth.isLoggedIn;
  const isClient = isLoggedIn && auth.roles?.includes(ROLES.client);
  const isOwner = isLoggedIn && auth.roles?.includes(ROLES.owner);
  const isAdmin = isLoggedIn && auth.roles?.includes(ROLES.admin);

  const acceptOffer = async (agreement) => {
    const response = await fetchPatchUserAgreementStatus(
      username,
      agreement.id,
      {
        status: "accepted",
      }
    );
    console.log(response);
  };

  const rejectOffer = async (agreement) => {
    const response = await fetchPatchUserAgreementStatus(
      username,
      agreement.id,
      {
        status: "rejected",
      }
    );
    console.log(response);
  };

  return (
    <div className="d-flex flex-wrap justify-content-around">
      {Array.isArray(agreements) &&
        agreements.map((agreement, index) => (
          <Card key={index} style={{ width: "19rem" }} className="mb-3 mx-4">
            <Card.Header>{agreement.name}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {" "}
                <strong>Apartment:</strong> {agreement.apartment.name}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Rent:</strong>{" "}
                {(
                  agreement.monthlyPayment + agreement.administrationFee
                ).toFixed(2)}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Duration:</strong> {agreement.signingDate} :{" "}
                {agreement.expirationDate}
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
                    <strong>Owner:</strong> {agreement.owner.firstName}{" "}
                    {agreement.owner.lastName} ({agreement.owner.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <strong>Contact:</strong> {agreement.owner.phoneNumber}
                  </ListGroup.Item>{" "}
                </>
              )}
            </ListGroup>
            <Card.Footer>
              <Card.Link
                className="flex-grow-1"
                as={Link}
                to={`/agreements/${agreement.id}`}
              >
                Details
              </Card.Link>
              <Card.Link
                className="flex-grow-1"
                as={Link}
                to={`/apartments/${agreement.apartment.id}`}
              >
                Apartment
              </Card.Link>
            </Card.Footer>

            {isProposed && isClient && (
              <Card.Footer>
                <Button
                  className="flex-grow-1"
                  variant="info"
                  onClick={() => {
                    acceptOffer(agreement);
                  }}
                >
                  Accept
                </Button>
                <Button
                  className="flex-grow-1"
                  variant="danger"
                  onClick={() => {
                    rejectOffer(agreement);
                  }}
                >
                  Reject
                </Button>
              </Card.Footer>
            )}
          </Card>
        ))}
    </div>
  );
}

export default OwnerAgreementsList;
