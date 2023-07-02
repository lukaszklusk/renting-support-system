import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ExclamationCircleFill } from "react-bootstrap-icons";

import useAuth from "../../hooks/useAuth";
import {
  getImageData,
  getApartmentPrice,
  getApartmentSize,
} from "../../hooks/useApartments";
import useApartments from "../../hooks/useApartments";

const OwnerApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const { auth } = useAuth();
  const fetchApartments = useApartments();
  const olStyle = {
    margin: 0,
    padding: 0,
  };
  useEffect(() => {
    const username = auth.username;
    if (username) {
      const fetchData = async () => {
        const data = await fetchApartments(username, id);
        setApartment(data);
      };

      fetchData();
    }
  }, []);

  if (apartment) {
    return (
      <Card className="my-3 mx-4">
        <Carousel fade>
          {Array.isArray(apartment.pictures) &&
            apartment.pictures.map((picture, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  alt="Apartment PNG"
                  src={getImageData(picture.image)}
                />
              </Carousel.Item>
            ))}
        </Carousel>
        <Card.Body>
          <Card.Title>{apartment.name}</Card.Title>
          <Card.Text> desc </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            {" "}
            <strong>Address:</strong> {apartment.address}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong> Size: </strong> {getApartmentSize(apartment)} m²{" "}
          </ListGroup.Item>
          {Array.isArray(apartment.equipment) && (
            <>
              <ListGroup.Item>
                <strong> Equipment: </strong>
              </ListGroup.Item>
              {apartment.equipment.map((item) => (
                <ListGroup.Item key={item.id} className="flex-row-reverse">
                  <div>{item.description}</div>

                  <div style={{ cursor: "pointer" }}>
                    <ExclamationCircleFill />
                  </div>
                </ListGroup.Item>
              ))}
            </>
          )}
        </ListGroup>
      </Card>
    );
  }
  return null;
};

export default OwnerApartmentDetails;
