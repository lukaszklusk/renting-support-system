import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ExclamationCircleFill } from "react-bootstrap-icons";

import useAuth from "../../hooks/useAuth";
import useUserApartmentById from "../../hooks/apartment/useUserApartmentById";
import useUserAgreementsByApartmentId from "../../hooks/agreement/useUserAgreementsByApartmentId";
import useIsUserApartmentByIdRented from "../../hooks/apartment/useIsUserApartmentByIdRented";
import SectionHeader from "../../components/common/SectionHeader";

const OwnerApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [agreements, setAgreements] = useState(null);
  const [activeAgreement, setActiveAgreement] = useState(null);
  const [proposedAgreements, setProposedAgreements] = useState(null);
  const [finishedAgreements, setFinishedAgreements] = useState(null);
  const [isRented, setIsRented] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { auth } = useAuth();
  const fetchUserApartmentById = useUserApartmentById();
  const fetchUserAgreementsByApartmentId = useUserAgreementsByApartmentId();
  const fetchIsUserApartmentByIdRented = useIsUserApartmentByIdRented();

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const apartment = await fetchUserApartmentById(username, id);
        const agreements = await fetchUserAgreementsByApartmentId(username, id);
        // const isRented = await fetchIsUserApartmentByIdRented(username, id);
        setApartment(apartment);
        setAgreements(agreements);

        // setIsRented(isRented);

        const activeAgreements = agreements.filter((agreement) => {
          return agreement.agreementStatus === "active";
        });

        const proposedAgreements = agreements.filter((agreement) => {
          return agreement.agreementStatus === "proposed";
        });

        const finishedAgreements = agreements.filter((agreement) => {
          return agreement.agreementStatus === "cancelled";
        });

        setIsRented(activeAgreements.length > 0);

        console.log("log", isRented && activeAgreements.length != 1);
        if (isRented && activeAgreements.length != 1) {
          console.log("Invalid nr of active agreements");
          return;
        }

        isRented && setActiveAgreement(activeAgreements[0]);
        setProposedAgreements(proposedAgreements);
        setFinishedAgreements(finishedAgreements);

        console.log("agreements", agreements);
        setIsDataFetched(true);
      };

      fetchData();
    }
  }, []);

  if (apartment) {
    return (
      <section>
        <SectionHeader title="Apartment Details" />

        <Card className="mb-3 mx-4">
          <Carousel fade>
            {Array.isArray(apartment.pictures) &&
              apartment.pictures.map((picture, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    alt="Apartment PNG"
                    src={picture.image}
                  />
                </Carousel.Item>
              ))}
          </Carousel>
          <Card.Header>
            <Card.Title>{apartment.name}</Card.Title>
            <Card.Text> {apartment.description} </Card.Text>
          </Card.Header>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              <strong>Address:</strong> {apartment.address}, {apartment.city}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong> Postal Code: </strong> {apartment.postalCode}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong> Size: </strong> {apartment.size} m²{" "}
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
                  <strong> Tenant: </strong> {activeAgreement.tenant.firstName}{" "}
                  {activeAgreement.tenant.lastName} (
                  {activeAgreement.tenant.username})
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong> Duration: </strong> {activeAgreement.signingDate} :{" "}
                  {activeAgreement.expirationDate}
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
                        <Card.Link as={Link} to={`/agreements/${agreement.id}`}>
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
            {Array.isArray(apartment.equipment) && (
              <>
                <ListGroup.Item>
                  <strong> Equipment: </strong>
                </ListGroup.Item>
                {apartment.equipment.map((item) => (
                  <ListGroup.Item key={item.id} className="flex-row-reverse">
                    <div>{item.description}</div>

                    <div style={{ cursor: "pointer" }}>
                      <ExclamationCircleFill />
                    </div>
                  </ListGroup.Item>
                ))}
              </>
            )}
            {Array.isArray(finishedAgreements) && (
              <>
                <ListGroup.Item>
                  <strong> Finished Agreements: </strong>
                </ListGroup.Item>
                {finishedAgreements.map((agreement) => (
                  <ListGroup.Item
                    key={agreement.id}
                    className="flex-row-reverse"
                  >
                    <Card.Link as={Link} to={`/agreement/${agreement.id}`}>
                      {agreement.signingDate} : {agreement.expirationDate}
                    </Card.Link>
                  </ListGroup.Item>
                ))}
              </>
            )}
          </ListGroup>
        </Card>
      </section>
    );
  }
  return null;
};

export default OwnerApartmentDetails;
