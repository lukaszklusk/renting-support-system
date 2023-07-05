import React from "react";
import { Row, Col } from "react-bootstrap";

const SectionHeader = ({ title }) => {
  return (
    <section className="mt-4 p-2 text-center bg-light">
      <Row>
        <Col>
          <h2 className="mb-1">{title}</h2>
        </Col>
      </Row>
    </section>
  );
};

export default SectionHeader;
