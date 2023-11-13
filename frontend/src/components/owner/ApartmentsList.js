import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const OwnerApartmentsList = ({ apartments }) => {
  return (
    <div className="d-flex flex-wrap justify-content-around">
      {Array.isArray(apartments) &&
        apartments.map((apartment, index) => (
          <Card key={index} style={{ width: "18rem" }} className="my-3 mx-4">
            <Card.Img variant="top" src={apartment.pictures[0].image} />
            <Card.Header>
              <Card.Title>{apartment.name}</Card.Title>
            </Card.Header>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <strong>Address:</strong> {apartment.address}, {apartment.city}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> Size: </strong> {apartment.size} m²{" "}
              </ListGroup.Item>
            </ListGroup>
            <Card.Footer className="d-flex">
              <Card.Link
                className="flex-grow-1"
                as={Link}
                to={`/apartments/${apartment.id}`}
              >
                Details
              </Card.Link>
              {/* TODO */}
              <Card.Link className="flex-grow-1" as={Link} to="#">
                Agreement
              </Card.Link>
            </Card.Footer>
          </Card>
        ))}
    </div>
  );
};

export default OwnerApartmentsList;
