import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import { Box, TextField } from "@mui/material";

import {
  ExclamationCircleFill,
  CheckCircleFill,
  PlusSquareFill,
  TrashFill,
} from "react-bootstrap-icons";

import useData from "../../hooks/useData";
import {
  useDeleteEquipment,
  usePatchEquipmentStatus,
  usePostEquipment,
} from "../../hooks/useApartments";
import { epochDaysToStringDate } from "../../hooks/useAgreements";
import SectionHeader from "../../components/common/SectionHeader";
import ApartmentDetailsSkeleton from "../../components/common/skeletons/ApartmentDetailsSkeleton";

const OwnerApartmentDetails = () => {
  const { id } = useParams();
  const [detailedApartment, setDetailedApartment] = useState(null);
  const [detailedAgreements, setDetailedAgreements] = useState([]);
  const [activeAgreement, setActiveAgreement] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState([]);
  const [finishedAgreements, setFinishedAgreements] = useState([]);
  const [canceledAgreements, setCanceledAgreements] = useState([]);
  const [isRented, setIsRented] = useState(false);

  const [newEquipmentName, setNewEquipmentName] = useState("");
  const [newEquipmentDescription, setNewEquipmentDescription] = useState("");

  const {
    username,
    isDataFetched,
    isClient,
    isOwner,
    isAdmin,
    apartments,
    setApartments,
    agreements,
  } = useData();

  const postEquipment = usePostEquipment();
  const deleteEquipment = useDeleteEquipment();
  const patchEquipmentStatus = usePatchEquipmentStatus();

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

  const handleEquipmentStatusChange = async (equipment) => {
    const newStatus = equipment.isBroken;
    await patchEquipmentStatus(username, detailedApartment.id, equipment.id, {
      status: newStatus,
    });

    let updatedEquipment = detailedApartment.equipment;
    updatedEquipment = updatedEquipment.map((e) =>
      e.id === equipment.id ? { ...e, isBroken: !newStatus } : e
    );
    const updatedDetailedApartment = {
      ...detailedApartment,
      equipment: updatedEquipment,
    };
    setApartments(
      apartments.map((apartment) =>
        apartment.id === detailedApartment.id
          ? updatedDetailedApartment
          : apartment
      )
    );
  };

  const handleNewEquipment = async (equipmentName, equipmentDescription) => {
    const newEquipment = {
      name: equipmentName,
      description: equipmentDescription,
      apartmentId: detailedApartment.id,
      isBroken: false,
    };

    const data = await postEquipment(
      username,
      detailedApartment.id,
      newEquipment
    );

    const updatedEquipment = [...detailedApartment.equipment, data];
    const updatedDetailedApartment = {
      ...detailedApartment,
      equipment: updatedEquipment,
    };

    setApartments(
      apartments.map((apartment) =>
        apartment.id === detailedApartment.id
          ? updatedDetailedApartment
          : apartment
      )
    );

    setNewEquipmentName("");
    setNewEquipmentDescription("");
  };

  const handleDeleteEquipment = async (eid) => {
    await deleteEquipment(username, detailedApartment.id, eid);

    const updatedEquipment = detailedApartment.equipment.filter(
      (e) => e.id !== eid
    );

    const updatedDetailedApartment = {
      ...detailedApartment,
      equipment: updatedEquipment,
    };

    setApartments(
      apartments.map((apartment) =>
        apartment.id === detailedApartment.id
          ? updatedDetailedApartment
          : apartment
      )
    );
  };

  console.log("detailedApartment:", detailedApartment);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isDataFetched && detailedApartment ? (
        <>
          <SectionHeader title="Apartment Details" />
          <Card className="mb-4">
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
                  {isOwner && (
                    <ListGroup.Item>
                      <strong> Tenant: </strong>{" "}
                      {activeAgreement.tenant.firstName}{" "}
                      {activeAgreement.tenant.lastName} (
                      {activeAgreement.tenant.username})
                    </ListGroup.Item>
                  )}
                  {isClient && (
                    <ListGroup.Item>
                      <strong> Owner: </strong>{" "}
                      {activeAgreement.owner.firstName}{" "}
                      {activeAgreement.owner.lastName} (
                      {activeAgreement.owner.username})
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <strong> Duration: </strong>{" "}
                    {epochDaysToStringDate(activeAgreement.signingDate)} :{" "}
                    {epochDaysToStringDate(activeAgreement.expirationDate)}
                  </ListGroup.Item>
                </>
              ) : (
                <ListGroup.Item>
                  <strong> Status: </strong> Vacant
                </ListGroup.Item>
              )}

              {isOwner && (
                <ListGroup.Item>
                  <strong> Agreements: </strong>
                  <Card.Link
                    as={Link}
                    to={`/apartments/${detailedApartment.id}/agreements`}
                  >
                    History
                  </Card.Link>
                </ListGroup.Item>
              )}

              {isOwner && (
                <ListGroup.Item>
                  <strong> Payments: </strong>
                  <Card.Link
                    as={Link}
                    to={`/apartments/${detailedApartment.id}/payments`}
                  >
                    History
                  </Card.Link>
                </ListGroup.Item>
              )}

              {detailedApartment?.properties?.length > 0 && (
                <>
                  <ListGroup.Item className="d-flex align-items-center">
                    <strong>Properties:</strong>
                  </ListGroup.Item>

                  {detailedApartment.properties.map((property) => (
                    <ListGroup.Item
                      key={property.id}
                      className="d-flex align-items-center"
                    >
                      <div className="flex-grow-1">
                        {property.name}: {property.value}
                        {}
                      </div>
                    </ListGroup.Item>
                  ))}
                </>
              )}

              {detailedApartment?.equipment?.length > 0 && (
                <>
                  <ListGroup.Item className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <strong>Equipment:</strong>
                    </div>
                    <div>
                      <strong>Status:</strong>
                    </div>
                  </ListGroup.Item>
                  {detailedApartment.equipment.map((equipment) => (
                    <ListGroup.Item
                      key={equipment.id}
                      className="d-flex align-items-center"
                    >
                      <div className="flex-grow-1">
                        {equipment.name}
                        {equipment?.description && (
                          <span>: {equipment.description}</span>
                        )}
                        {isOwner && (
                          <span
                            onClick={() => {
                              handleDeleteEquipment(equipment.id);
                            }}
                            style={{ cursor: "pointer" }}
                            className="ms-1"
                          >
                            <TrashFill color="red" />
                          </span>
                        )}
                        {}
                      </div>

                      <div
                        onClick={() => {
                          handleEquipmentStatusChange(equipment);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {equipment.isBroken ? (
                          <ExclamationCircleFill color="red" />
                        ) : (
                          <CheckCircleFill color="blue" />
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="d-flex align-items-center">
                    <div className="flex-grow-1 me-1">
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter equipment name"
                        id="newEquipmentName"
                        value={newEquipmentName}
                        onChange={(e) => {
                          setNewEquipmentName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex-grow-1 me-1">
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter equipment description"
                        id="newEquipmentDescription"
                        value={newEquipmentDescription}
                        onChange={(e) => {
                          setNewEquipmentDescription(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        newEquipmentName &&
                          handleNewEquipment(
                            newEquipmentName,
                            newEquipmentDescription
                          );
                      }}
                    >
                      <PlusSquareFill color="green" />
                    </div>
                  </ListGroup.Item>
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
        <ApartmentDetailsSkeleton />
      )}
    </Box>
  );
};

export default OwnerApartmentDetails;
