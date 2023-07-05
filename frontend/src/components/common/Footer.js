import React from "react";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <Row>
        <Col className="text-center">
          <p>&copy; 2023 RentSys</p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
