import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { getImageData } from "../../hooks/useApartments";
import useApartments from "../../hooks/useApartments";

const OwnerDashboardApartments = () => {
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
    <Carousel fade>
      {Array.isArray(apartments) &&
        apartments.map((apartment, index) => (
          <Carousel.Item key={index}>
            <img
              //   width={800}
              //   height={400}
              className="d-block w-100"
              alt="Apartment PNG"
              src={getImageData(apartment.pictures[0].image)}
            />
            <Link to={`/apartments/${apartment.id}`}>
              <Carousel.Caption>
                <h3>{apartment.name}</h3>
                <p>{apartment.description}</p>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
    </Carousel>
  );
};

export default OwnerDashboardApartments;
