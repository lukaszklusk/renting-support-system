import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ROLES } from "../../config/roles";
import useAuth from "../../hooks/useAuth";

function OwnerAgreementsList({ agreements }) {
  const { auth } = useAuth();
  const isLoggedIn = auth.isLoggedIn;
  const isClient = isLoggedIn && auth.roles?.includes(ROLES.client);
  const isOwner = isLoggedIn && auth.roles?.includes(ROLES.owner);
  const isAdmin = isLoggedIn && auth.roles?.includes(ROLES.admin);

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
          </Card>
        ))}
    </div>
  );
}

export default OwnerAgreementsList;
