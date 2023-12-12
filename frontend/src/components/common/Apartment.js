import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { Trash } from "react-bootstrap-icons";

import { useDeleteApartment } from "../../hooks/useApartments";
import useData from "../../hooks/useData";

const Apartment = ({ item: apartment, toShowDeleteButton }) => {
  const { username, setApartments, setAgreements, isOwner } = useData();

  const deleteApartment = useDeleteApartment();

  const handleDeleteApartment = async (id) => {
    await deleteApartment(username, id);
    setApartments((prevApartments) =>
      prevApartments?.filter((apartment) => apartment.id !== id)
    );
    setAgreements((prevAgreements) =>
      prevAgreements?.filter((agreement) => agreement.apartmentId !== id)
    );
  };

  return (
    <Card
      style={{ minWidth: "18rem", maxWidth: "28rem" }}
      className="my-3 mx-4"
    >
      <Card.Img variant="top" src={apartment.pictures[0].image} />
      <Card.Header className="d-flex justify-content-between">
        <Card.Title className="flex-grow-2">{apartment.name}</Card.Title>
        {toShowDeleteButton && (
          <Card.Title
            onClick={() => {
              handleDeleteApartment(apartment.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <Trash color="red" />
          </Card.Title>
        )}
      </Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          <strong>Address:</strong> {apartment.address}, {apartment.city}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong> Size: </strong> {apartment.size} m²{" "}
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-space-between">
          <Card.Link
            className="flex-grow-1"
            as={Link}
            to={`/apartments/${apartment.id}`}
          >
            Details
          </Card.Link>
          {isOwner && (
            <Card.Link
              className="flex-grow-1"
              as={Link}
              to={`/apartments/${apartment.id}/agreements`}
            >
              Agreements
            </Card.Link>
          )}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default Apartment;
