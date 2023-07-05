import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useAuth from "../../hooks/useAuth";
import useAgreements from "../../hooks/useAgreements";

function OwnerAgreements() {
  const [agreements, setAgreements] = useState(null);
  const { auth } = useAuth();
  const fetchAgreements = useAgreements();

  useEffect(() => {
    const username = auth.username;
    if (username) {
      const fetchData = async () => {
        const data = await fetchAgreements(username);
        setAgreements(data);
      };

      fetchData();
    }
  }, []);

  return (
    <div className="d-flex flex-wrap justify-content-around">
      {Array.isArray(agreements) &&
        agreements.map((agreement, index) => (
          <Card key={index} style={{ width: "19rem" }} className="my-3 mx-4">
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

              <ListGroup.Item>
                {" "}
                <strong>Tenant:</strong> {agreement.tenant.firstName}{" "}
                {agreement.tenant.lastName} ({agreement.tenant.username})
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Contact:</strong> {agreement.tenant.phoneNumber}
              </ListGroup.Item>
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

export default OwnerAgreements;
