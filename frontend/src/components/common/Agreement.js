import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useData from "../../hooks/useData";
import { Button } from "react-bootstrap";
import {
  usePatchUserAgreementStatus,
  epochDaysToStringDate,
} from "../../hooks/useAgreements";

function Agreement({
  item: agreement,
  isPresent,
  toResponse,
  toWithdrawn,
  toCancel,
}) {
  const {
    username,
    isClient,
    isOwner,
    isAdmin,
    setAgreements,
    setIsDataFetched,
  } = useData();
  const fetchPatchUserAgreementStatus = usePatchUserAgreementStatus();

  const handleOffer = async (agreement, status) => {
    const data = await fetchPatchUserAgreementStatus(username, agreement.id, {
      status: status,
      byOwner: isOwner,
    });
    console.log("data:", data);
    setAgreements((prevAgreements) =>
      prevAgreements?.map((a) => (a.id === agreement.id ? data : a))
    );
    setIsDataFetched(false);
  };

  return (
    <div
      style={{ padding: "10px", maxWidth: "25rem" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Card className="mb-3 mx-4">
        <Card.Header>{agreement.name}</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {" "}
            <strong>Apartment:</strong> {agreement.apartmentName}{" "}
          </ListGroup.Item>
          <ListGroup.Item>
            {" "}
            <strong>Rent:</strong>{" "}
            {(agreement.monthlyPayment + agreement.administrationFee).toFixed(
              2
            )}{" "}
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
          <ListGroup.Item className="d-flex justify-space-between">
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
          </ListGroup.Item>
        </ListGroup>

        {isPresent && (
          <Card.Footer className="d-flex justify-space-between">
            {toCancel && (
              <Card.Link className="flex-grow-1">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleOffer(agreement, false);
                  }}
                >
                  Cancel
                </Button>
              </Card.Link>
            )}

            {toWithdrawn && (
              <Card.Link className="flex-grow-1">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleOffer(agreement, false);
                  }}
                >
                  Withdraw
                </Button>
              </Card.Link>
            )}

            {toResponse && (
              <>
                <Card.Link className="flex-grow-1">
                  <Button
                    variant="success"
                    onClick={() => {
                      handleOffer(agreement, true);
                    }}
                  >
                    Accept
                  </Button>
                </Card.Link>
                <Card.Link className="flex-grow-1">
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleOffer(agreement, false);
                    }}
                  >
                    Reject
                  </Button>
                </Card.Link>
              </>
            )}
          </Card.Footer>
        )}
      </Card>
    </div>
  );
}

export default Agreement;
