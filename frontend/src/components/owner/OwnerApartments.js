import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useAuth from "../../hooks/useAuth";
import {
  getImageData,
  getApartmentPrice,
  getApartmentSize,
} from "../../hooks/useApartments";
import useApartments from "../../hooks/useApartments";

const OwnerApartments = () => {
  const [apartments, setApartments] = useState(null);
  const { auth } = useAuth();
  const fetchApartments = useApartments();

  useEffect(() => {
    const username = auth.username;
    if (username) {
      const fetchData = async () => {
        const data = await fetchApartments(username);
        setApartments(data);
      };

      fetchData();
    }
  }, []);

  return (
    <div className="d-flex flex-wrap justify-content-around">
      {Array.isArray(apartments) &&
        apartments.map((apartment, index) => (
          <Card key={index} style={{ width: "18rem" }} className="my-3 mx-4">
            <Card.Img
              variant="top"
              src={getImageData(apartment.pictures[0].image)}
            />
            <Card.Body>
              <Card.Title>{apartment.name}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Address: {apartment.address}</ListGroup.Item>
              <ListGroup.Item>
                Size: {getApartmentSize(apartment)} m²{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                Price: {getApartmentPrice(apartment)}
              </ListGroup.Item>
            </ListGroup>
            <Card.Body className="d-flex">
              <Card.Link className="flex-grow-1" href="#">
                Details
              </Card.Link>
              <Card.Link className="flex-grow-1" href="#">
                Agreement
              </Card.Link>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};

export default OwnerApartments;
