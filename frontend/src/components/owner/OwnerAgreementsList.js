import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ROLES } from "../../config/roles";
import useAuth from "../../hooks/useAuth";
import useData from "../../hooks/useData";
import { Button } from "react-bootstrap";
import { usePatchUserAgreementStatus } from "../../hooks/useAgreements";

function OwnerAgreementsList({ agreements, isProposed }) {
  const { username, isClient, isOwner, isAdmin } = useData();
  const fetchPatchUserAgreementStatus = usePatchUserAgreementStatus();

  const epochDaysToStringDate = (epochDays) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const date = new Date(
      epochDays * millisecondsPerDay +
        new Date().getTimezoneOffset() * 60 * 1000
    );
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const acceptOffer = async (agreement) => {
    const response = await fetchPatchUserAgreementStatus(
      username,
      agreement.id,
      {
        status: isOwner ? "active" : "accepted",
      }
    );
    console.log(response);
  };

  const rejectOffer = async (agreement) => {
    const response = await fetchPatchUserAgreementStatus(
      username,
      agreement.id,
      {
        status: isOwner ? "rejected_owner" : "rejected_client",
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
                <strong>Apartment:</strong> {agreement.apartmentName}{" "}
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
                <strong>Duration:</strong>{" "}
                {epochDaysToStringDate(agreement.signingDate)} :{" "}
                {epochDaysToStringDate(agreement.expirationDate)}
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
                to={`/apartments/${agreement.apartmentId}`}
              >
                Apartment
              </Card.Link>
            </Card.Footer>

            {isProposed && (
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
