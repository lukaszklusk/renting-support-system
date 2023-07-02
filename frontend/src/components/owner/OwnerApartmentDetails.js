import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Carousel } from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useAuth from "../../hooks/useAuth";
import {
  getImageData,
  getApartmentPrice,
  getApartmentSize,
} from "../../hooks/useApartments";
import useApartments from "../../hooks/useApartments";

const OwnerApartmentDetails = () => {
  const { id } = useParams();
  return <h1>{id}</h1>;
};

export default OwnerApartmentDetails;
