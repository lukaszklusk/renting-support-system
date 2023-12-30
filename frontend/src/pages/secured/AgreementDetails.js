import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useData from "../../hooks/useData";
import SectionHeader from "../../components/common/SectionHeader";

import AgreementDetailsSkeleton from "../../components/common/skeletons/AgreementDetailsSkeleton";
import { Box } from "@mui/material";

import { epochDaysToStringDate } from "../../hooks/useAgreements";

const AgreementDetails = () => {
  const { id } = useParams();

  const { isDataFetched, isClient, isOwner, isAdmin, apartments, agreements } =
    useData();

  const [detailedAgreement, setDetailedAgreement] = useState(null);
  const [detailedApartment, setDetailedApartment] = useState(null);

  const onDetailedAgreementLoad = () => {
    setDetailedApartment(
      apartments.find((item) => item.id === detailedAgreement?.apartmentId)
    );
  };

  const onAgreementsLoad = () => {
    setDetailedAgreement(agreements.find((item) => item.id === parseInt(id)));
  };

  useEffect(onAgreementsLoad, [agreements]);
  useEffect(onDetailedAgreementLoad, [detailedAgreement]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isDataFetched && detailedAgreement?.id ? (
        <>
          <SectionHeader title="Agreement Details" />
          <Card className="mb-3">
            <Card.Header>{detailedAgreement.name}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {" "}
                <strong>Status:</strong> {detailedAgreement.agreementStatus}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Apartment:</strong>{" "}
                {detailedApartment?.name ? (
                  <Card.Link
                    as={Link}
                    to={`/apartments/${detailedAgreement?.apartmentId}`}
                  >
                    {detailedApartment?.name}
                  </Card.Link>
                ) : (
                  <>{detailedAgreement?.apartmentName}</>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> Rent: </strong>{" "}
                {(
                  detailedAgreement.administrationFee +
                  detailedAgreement.monthlyPayment
                ).toFixed(2)}
              </ListGroup.Item>
              {isOwner && (
                <>
                  <ListGroup.Item>
                    {" "}
                    <strong>Tenant:</strong>{" "}
                    {detailedAgreement.tenant.firstName}{" "}
                    {detailedAgreement.tenant.lastName} (
                    {detailedAgreement.tenant.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <strong>Contact:</strong>{" "}
                    {detailedAgreement.tenant.phoneNumber}
                  </ListGroup.Item>{" "}
                </>
              )}{" "}
              {isClient && (
                <>
                  <ListGroup.Item>
                    {" "}
                    <strong>Owner:</strong> {detailedAgreement.owner.firstName}{" "}
                    {detailedAgreement.owner.lastName} (
                    {detailedAgreement.owner.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <strong>Contact:</strong>{" "}
                    {detailedAgreement.owner.phoneNumber}
                  </ListGroup.Item>{" "}
                </>
              )}
              <ListGroup.Item>
                <strong> Duration: </strong>
                {epochDaysToStringDate(detailedAgreement.signingDate)} :{" "}
                {epochDaysToStringDate(detailedAgreement.expirationDate)}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </>
      ) : (
        <AgreementDetailsSkeleton />
      )}
    </Box>
  );
};

export default AgreementDetails;
