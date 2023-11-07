import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ExclamationCircleFill, CheckCircleFill } from "react-bootstrap-icons";

import useData from "../../hooks/useData";
import { usePatchApartmentEquipmentStatus } from "../../hooks/useApartments";
import SectionHeader from "../../components/common/SectionHeader";

const OwnerApartmentDetails = () => {
  const { id } = useParams();
  const [detailedApartment, setDetailedApartment] = useState(null);
  const [detailedAgreements, setDetailedAgreements] = useState([]);
  const [activeAgreement, setActiveAgreement] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState([]);
  const [finishedAgreements, setFinishedAgreements] = useState([]);
  const [canceledAgreements, setCanceledAgreements] = useState([]);
  const [isRented, setIsRented] = useState(false);

  const {
    username,
    isDataFetched,
    setIsDataFetched,
    isClient,
    isOwner,
    isAdmin,
    apartments,
    agreements,
  } = useData();

  const patchUserEquipmentStatus = usePatchApartmentEquipmentStatus();

  const onApartmentsLoad = () => {
    setDetailedApartment(apartments.find((item) => item.id === parseInt(id)));
  };

  const onAgreementsLoad = () => {
    setDetailedAgreements(
      agreements.filter((item) => item.apartmentId === parseInt(id))
    );
  };

  const onDetailedApartmentLoad = () => {
    setIsRented(detailedApartment?.tenant != null);
  };

  const onDetailedAgreementsLoad = () => {
    setActiveAgreement(
      detailedAgreements?.find((item) => item.agreementStatus == "active")
    );
    setProposedAgreements(
      detailedAgreements?.find((item) => item.agreementStatus == "proposed")
    );
    setFinishedAgreements(
      detailedAgreements?.find((item) => item.agreementStatus == "finished")
    );
    setCanceledAgreements(
      detailedAgreements?.find((item) =>
        item.agreementStatus.startsWith("canceled")
      )
    );
  };

  useEffect(onApartmentsLoad, [apartments]);
  useEffect(onAgreementsLoad, [agreements]);
  useEffect(onDetailedApartmentLoad, [detailedApartment]);
  useEffect(onDetailedAgreementsLoad, [detailedAgreements]);

  const handleReport = async (equipment) => {
    const data = await patchUserEquipmentStatus(
      username,
      detailedApartment.id,
      equipment.id,
      { status: equipment.isBroken }
    );
    console.log("data:", data);
    setIsDataFetched(false);
  };

  const epochDaysToStringDate = (epochDays) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const date = new Date(
      epochDays * millisecondsPerDay +
        new Date().getTimezoneOffset() * 60 * 1000
    );
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <section>
      {isDataFetched && detailedApartment ? (
        <>
          <SectionHeader title="Apartment Details" />
          <Card className="mb-3 mx-4">
            <Carousel fade>
              {Array.isArray(detailedApartment?.pictures) &&
                detailedApartment?.pictures.map((picture, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      alt="Apartment PNG"
                      src={"data:image/png;base64," + picture.imageData}
                    />
                  </Carousel.Item>
                ))}
            </Carousel>
            <Card.Header>
              <Card.Title>{detailedApartment.name}</Card.Title>
              <Card.Text> {detailedApartment.description} </Card.Text>
            </Card.Header>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <strong>Address:</strong> {detailedApartment.address},{" "}
                {detailedApartment.city}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> Postal Code: </strong> {detailedApartment.postalCode}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> Size: </strong> {detailedApartment.size} m²{" "}
              </ListGroup.Item>
              {isRented ? (
                <>
                  <ListGroup.Item>
                    <strong> Status: </strong> Rented
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong> Rent: </strong>{" "}
                    {(
                      activeAgreement.administrationFee +
                      activeAgreement.monthlyPayment
                    ).toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong> Tenant: </strong>{" "}
                    {activeAgreement.tenant.firstName}{" "}
                    {activeAgreement.tenant.lastName} (
                    {activeAgreement.tenant.username})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong> Duration: </strong>{" "}
                    {epochDaysToStringDate(activeAgreement.signingDate)} :{" "}
                    {epochDaysToStringDate(activeAgreement.expirationDate)}
                  </ListGroup.Item>
                </>
              ) : (
                <>
                  <ListGroup.Item>
                    <strong> Status: </strong> Vacant
                  </ListGroup.Item>

                  {Array.isArray(proposedAgreements) && (
                    <>
                      <ListGroup.Item>
                        <strong> Proposed Agreements: </strong>
                      </ListGroup.Item>
                      {proposedAgreements.map((agreement) => (
                        <ListGroup.Item
                          key={agreement.id}
                          className="flex-row-reverse"
                        >
                          <Card.Link
                            as={Link}
                            to={`/agreements/${agreement.id}`}
                          >
                            {agreement.tenant.firstName}{" "}
                            {agreement.tenant.lastName} (
                            {agreement.tenant.username})
                          </Card.Link>
                        </ListGroup.Item>
                      ))}
                    </>
                  )}
                </>
              )}
              {Array.isArray(detailedApartment.equipment) && (
                <>
                  <ListGroup.Item>
                    <strong> Equipment: </strong>
                  </ListGroup.Item>
                  {detailedApartment.equipment.map((item) => (
                    <ListGroup.Item
                      key={item.id}
                      className="flex-row-reverse"
                      onClick={() => {
                        handleReport(item);
                      }}
                    >
                      <div>{item.description}</div>

                      <div style={{ cursor: "pointer" }}>
                        {item.isBroken ? (
                          <ExclamationCircleFill />
                        ) : (
                          <CheckCircleFill />
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </>
              )}
              {isOwner && Array.isArray(finishedAgreements) && (
                <>
                  <ListGroup.Item>
                    <strong> Finished Agreements: </strong>
                  </ListGroup.Item>
                  {finishedAgreements.map((agreement) => (
                    <ListGroup.Item
                      key={agreement.id}
                      className="flex-row-reverse"
                    >
                      <Card.Link as={Link} to={`/agreements/${agreement.id}`}>
                        {agreement.signingDate} : {agreement.expirationDate}
                      </Card.Link>
                    </ListGroup.Item>
                  ))}
                </>
              )}
            </ListGroup>
          </Card>
        </>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default OwnerApartmentDetails;
