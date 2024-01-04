import React from "react";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  const year = new Date().getFullYear().toString();

  return (
    <footer className="bg-dark text-light pt-2">
      <Row>
        <Col className="text-center">
          <p>&copy; {year} RentSys</p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
