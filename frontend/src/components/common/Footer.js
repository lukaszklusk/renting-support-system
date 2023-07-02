import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; 2023 RentSys</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
