import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  PencilSquare,
  HouseFill,
  PersonCircle,
  CalendarCheckFill,
  CalendarXFill,
  CreditCardFill,
  PassFill,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import useAxiosUser from "../../hooks/useAxiosUser";
import useAuth from "../../hooks/useAuth";
import { useUserApartments } from "../../hooks/useApartments";

const PRESENT_REGEX = /.+/;
const NUMBER_REGEX = /^(?!0\d)\d{1,5}(\.\d{1,2})?$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const AddAgreement = () => {
  const axiosUser = useAxiosUser();
  const fetchUserApartments = useUserApartments();

  const nameRef = useRef();

  const { auth } = useAuth();
  const username = auth.username;
  const AGREEMENT_POST_URL = `/user/${username}/agreement`;

  const [ownerApartments, setOwnerApartments] = useState([]);

  const [agreementName, setAgreementName] = useState("");
  const [isAgreementNameValid, setIsAgreementNameValid] = useState(false);

  const [apartmentName, setApartmentName] = useState("");
  const [isApartmentNameValid, setIsApartmentNameValid] = useState(false);

  const [clientUsername, setClientUsername] = useState("");
  const [isClientUsernameValid, setIsClientUsernameValid] = useState(false);

  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [isMonthlyPaymentValid, setIsMontlyPaymentValid] = useState(false);

  const [administrationFee, setAdministrationFee] = useState("");
  const [isAdministrationFeeValid, setIsAdministrationFeeValid] =
    useState(false);

  const [signingDate, setSigningDate] = useState("");
  const [isSigningDateValid, setIsSigningDateValid] = useState(false);

  const [expirationDate, setExpirationDate] = useState("");
  const [isExpirationDateValid, setIsExpirationDateValid] = useState(false);

  const [submitMsg, setSubmitMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const username = auth.username;

    if (username) {
      const fetchData = async () => {
        const apartments = await fetchUserApartments(username);
        console.log("apartments", apartments);
        setOwnerApartments(apartments);
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [
    agreementName,
    apartmentName,
    monthlyPayment,
    administrationFee,
    signingDate,
  ]);

  useEffect(() => {
    const isValid = PRESENT_REGEX.test(agreementName);
    console.log(isValid);
    console.log(agreementName);
    setIsAgreementNameValid(isValid);
  }, [agreementName]);

  useEffect(() => {
    const isValid = PRESENT_REGEX.test(apartmentName);
    console.log(isValid);
    console.log(apartmentName);
    setIsApartmentNameValid(isValid);
  }, [apartmentName]);

  useEffect(() => {
    const isValid = USERNAME_REGEX.test(clientUsername);
    console.log(isValid);
    console.log(clientUsername);
    setIsClientUsernameValid(isValid);
  }, [clientUsername]);

  useEffect(() => {
    const isValid = PRESENT_REGEX.test(monthlyPayment);
    console.log(isValid);
    console.log(monthlyPayment);
    setIsMontlyPaymentValid(isValid);
  }, [monthlyPayment]);

  useEffect(() => {
    const isValid = NUMBER_REGEX.test(administrationFee);
    console.log(isValid);
    console.log(administrationFee);
    setIsAdministrationFeeValid(isValid);
  }, [administrationFee]);

  useEffect(() => {
    const isValid = DATE_REGEX.test(signingDate);
    console.log(isValid);
    console.log(signingDate);
    setIsSigningDateValid(isValid);
  }, [signingDate]);

  useEffect(() => {
    const isValid = DATE_REGEX.test(expirationDate);
    console.log(isValid);
    console.log(signingDate);
    setIsExpirationDateValid(isValid);
  }, [expirationDate]);

  const getApartmentIdByName = (apartements, name) => {
    const apartmentsByName = apartements.filter((apartment) => {
      return apartment.name === name;
    });
    if (apartmentsByName.length === 0) {
      console.log("error: ", name, "apartment not found");
      return null;
    } else if (apartmentsByName.length > 1) {
      console.log("error: ", name, "multiple names");
      return null;
    }
    return apartmentsByName[0].id.toString();
  };

  const handleCreateAgreement = async (e) => {
    e.preventDefault();

    if (
      !PRESENT_REGEX.test(agreementName) ||
      !PRESENT_REGEX.test(apartmentName) ||
      !NUMBER_REGEX.test(monthlyPayment) ||
      !NUMBER_REGEX.test(administrationFee) ||
      !DATE_REGEX.test(signingDate) ||
      !DATE_REGEX.test(expirationDate) ||
      !USERNAME_REGEX.test(clientUsername)
    ) {
      setErrMsg("Invalid Entry");
      return;
    }

    console.log("To Send");

    try {
      const payload = JSON.stringify({
        name: agreementName,
        apartmentId: getApartmentIdByName(ownerApartments, apartmentName),
        administrationFee,
        monthlyPayment,
        signingDate,
        expirationDate,
        ownerAccountNo: "ownerAccountNo",
        tenant: clientUsername,
      });

      const response = await axiosUser.post(AGREEMENT_POST_URL, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.data);
      console.log(JSON.stringify(response));
      setSubmitMsg("Apartment created sucessfully");
      setErrMsg("");
    } catch (err) {
      setSubmitMsg("");
      if (!err?.response) {
        setErrMsg("Server did not respond");
      } else {
        setErrMsg("Error");
        console.log(err.response);
      }
    }
  };

  return (
    <section>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-5">
                Propose New Agreement
              </Card.Title>
              {errMsg && <Alert variant="danger">{errMsg}</Alert>}
              {submitMsg && <Alert variant="success">{submitMsg}</Alert>}
              <Form onSubmit={handleCreateAgreement}>
                <Form.Group controlId="formAgreementName" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <PencilSquare />
                    </InputGroup.Text>
                    <Form.Control
                      ref={nameRef}
                      type="text"
                      placeholder="Enter agreement name"
                      value={agreementName}
                      onChange={(e) => setAgreementName(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isAgreementNameValid}
                      isInvalid={agreementName && !isAgreementNameValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter agreement name
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formApartment" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <HouseFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter apartment name"
                      value={apartmentName}
                      onChange={(e) => setApartmentName(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isApartmentNameValid}
                      isInvalid={apartmentName && !isApartmentNameValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment name
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group
                  controlId="formAgreementDescription"
                  className="my-3"
                >
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <PersonCircle />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter client username"
                      value={clientUsername}
                      onChange={(e) => setClientUsername(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isClientUsernameValid}
                      isInvalid={clientUsername && !isClientUsernameValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter a username with following restrictions:
                      <br />
                      - between 4 and 24 characters <br />
                      - begin with a letter <br />- only numbers, letters,
                      underscores and hyphens allowed
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group
                  controlId="formAgreementMonthlyPayment"
                  className="my-3"
                >
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <CreditCardFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter monthly payment"
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isMonthlyPaymentValid}
                      isInvalid={monthlyPayment && !isMonthlyPaymentValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter monthly payment ammount
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formAdministrationFee" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <PassFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter administration fee"
                      value={administrationFee}
                      onChange={(e) => setAdministrationFee(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isAdministrationFeeValid}
                      isInvalid={administrationFee && !isAdministrationFeeValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter administration fee amount
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formSigningDate" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <CalendarCheckFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      placeholder="Enter signing date"
                      value={signingDate}
                      onChange={(e) => setSigningDate(e.target.value)}
                      required
                      pattern="yyyy-MM-dd"
                      autoComplete="off"
                      isValid={isSigningDateValid}
                      isInvalid={signingDate && !isSigningDateValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter signing date
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formExpiringDate" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <CalendarXFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      placeholder="Set expiration date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      required
                      pattern="yyyy-MM-dd"
                      autoComplete="off"
                      isValid={isExpirationDateValid}
                      isInvalid={expirationDate && !isExpirationDateValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter expiration date
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      isAgreementNameValid &&
                      isApartmentNameValid &&
                      isMonthlyPaymentValid &&
                      isAdministrationFeeValid &&
                      isSigningDateValid &&
                      isExpirationDateValid
                        ? false
                        : true
                    }
                  >
                    Propose Agreement
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default AddAgreement;
