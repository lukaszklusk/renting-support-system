import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";

const OwnerDashboardApartments = ({ apartments }) => {
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
              src={apartment.pictures[0].image}
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
