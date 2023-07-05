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
  HouseFill,
  EnvelopeFill,
  List,
  GeoAltFill,
  ImageFill,
  ArrowsFullscreen,
  Tools,
  ListCheck,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import axios from "../../services/axios";

const APARTMENT_POST_URL = "/sign-up";

const PRESENT_REGEX = /.+/;
const DESCRIPTION_REGEX = /^(?!(\S+\s+){101})((\S+\s+){9,100}\S+)$/;
const ZIP_CODE_REGEX = /^\d{2}-\d{3}$/;
const SIZE_REGEX = /^(?!0\d)\d{1,5}(\.\d{1,2})?$/;

const NewApartment = () => {
  const location = useLocation();

  const nameRef = useRef();

  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);

  const [decription, setDescription] = useState("");
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);

  const [address, setAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);

  const [zipCode, setZipCode] = useState("");
  const [isZipCodeValid, setIsZipCodeValid] = useState(false);

  const [size, setSize] = useState("");
  const [isSizeValid, setIsSizeValid] = useState(false);

  const [pictures, setPictures] = useState([]);
  const [isPicturesValid, setIsPicturesValid] = useState(false);
  const [isFilesUpload, setIsFilesUpload] = useState(false);

  const [equipments, setEquipments] = useState([""]);
  const [properties, setProperties] = useState([""]);

  const [submitMsg, setSubmitMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [name, decription, address, zipCode, size]);

  useEffect(() => {
    const isValid = PRESENT_REGEX.test(name);
    console.log(isValid);
    console.log(name);
    setIsNameValid(isValid);
  }, [name]);

  useEffect(() => {
    const isValid = DESCRIPTION_REGEX.test(decription);
    console.log(isValid);
    console.log(decription);
    setIsDescriptionValid(isValid);
  }, [decription]);

  useEffect(() => {
    const isValid = PRESENT_REGEX.test(address);
    console.log(isValid);
    console.log(address);
    setIsAddressValid(isValid);
  }, [address]);

  useEffect(() => {
    const isValid = ZIP_CODE_REGEX.test(zipCode);
    console.log(isValid);
    console.log(zipCode);
    setIsZipCodeValid(isValid);
  }, [zipCode]);

  useEffect(() => {
    const isValid = SIZE_REGEX.test(size);
    console.log(isValid);
    console.log(size);
    setIsSizeValid(isValid);
  }, [size]);

  useEffect(() => {
    const isValid = pictures.length > 0;
    console.log(isValid);
    setIsPicturesValid(isValid);
  }, [pictures]);

  const handleFilesUpload = (event) => {
    console.log("handler");
    setIsFilesUpload(true);
    const files = event.target.files;
    const selectedPngFiles = Array.from(files).filter(
      (file) => file.type === "image/png"
    );
    setPictures(selectedPngFiles);
    console.log(pictures);
  };

  const handleEquipmentChange = (index, event) => {
    const newValues = [...equipments];
    newValues[index] = event.target.value;
    setEquipments(newValues);
  };

  const handlePropertiesChange = (index, event) => {
    const newValues = [...properties];
    newValues[index] = event.target.value;
    setProperties(newValues);
  };

  const handleAddEquipment = () => {
    setEquipments([...equipments, ""]);
  };

  const handleRemoveEquipment = (index) => {
    const newEquipments = [...equipments];
    newEquipments.splice(index, 1);
    setEquipments(newEquipments);
  };

  const handleAddProperties = () => {
    setProperties([...properties, ""]);
  };

  const handleRemoveProperty = (index) => {
    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);
  };

  const handleCreateApartment = async (e) => {
    e.preventDefault();

    if (
      !PRESENT_REGEX.test(name) ||
      !DESCRIPTION_REGEX.test(decription) ||
      !PRESENT_REGEX.test(address) ||
      !ZIP_CODE_REGEX.test(zipCode) ||
      !SIZE_REGEX.test(size)
    ) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      console.log("properties");
      console.log(properties);
      const payload = JSON.stringify({
        apartmentName: name,
        description: decription,
        address: address,
        city: "city",
        postalCode: zipCode,
        size: size,
      });

      console.log(payload);
      const response = await axios.post(APARTMENT_POST_URL, payload, {
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
                Create New Apartment
              </Card.Title>
              {errMsg && <Alert variant="danger">{errMsg}</Alert>}
              {submitMsg && <Alert variant="success">{submitMsg}</Alert>}
              <Form onSubmit={handleCreateApartment}>
                <Form.Group controlId="formEmail" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <HouseFill />
                    </InputGroup.Text>
                    <Form.Control
                      ref={nameRef}
                      type="text"
                      placeholder="Enter apartment name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isNameValid}
                      isInvalid={name && !isNameValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment name
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formUsername" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <List />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter description"
                      value={decription}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isDescriptionValid}
                      isInvalid={decription && !isDescriptionValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter a apartment description with following
                      restrictions:
                      <br />- between 10 and 100 words
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formFirstName" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <GeoAltFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isAddressValid}
                      isInvalid={address && !isAddressValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment address
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formLastName" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <EnvelopeFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter zip code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isZipCodeValid}
                      isInvalid={zipCode && !isZipCodeValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment zip code in the following format:
                      <br />
                      XX-XXX
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPhoneNumber" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <ArrowsFullscreen />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter apartement size in m²"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isSizeValid}
                      isInvalid={size && !isSizeValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment size
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPhoneNumber2" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <ImageFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      placeholder="Select png"
                      value={pictures}
                      onChange={handleFilesUpload}
                      //   required
                      isValid={isPicturesValid}
                      isInvalid={isFilesUpload && !isPicturesValid}
                      accept=".png"
                      multiple
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please upload at least one PNG picture
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {equipments.map((equipment, index) => (
                  <InputGroup className={index === 0 && "mt-3"}>
                    <InputGroup.Text className="transparent-input-group-text">
                      <ListCheck />
                    </InputGroup.Text>
                    <Form.Group controlId={`equipment${index}`} key={index}>
                      <Form.Control
                        type="text"
                        value={equipment}
                        onChange={(event) =>
                          handleEquipmentChange(index, event)
                        }
                        placeholder="Enter equipment"
                        autoComplete="off"
                        disabled={equipments.length !== index + 1}
                        isValid={equipment.length > 0}
                      />
                    </Form.Group>
                    {equipments.length !== index + 1 ? (
                      <div>
                        <Button
                          variant="danger"
                          //   className="py-1"
                          onClick={() => handleRemoveEquipment(index)}
                        >
                          -
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="success"
                          onClick={handleAddEquipment}
                          //   className="py-1"
                        >
                          +
                        </Button>
                      </div>
                    )}
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment equipment
                    </Form.Control.Feedback>
                  </InputGroup>
                ))}

                {properties.map((property, index) => (
                  <InputGroup className={index === 0 && "mt-3"}>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Tools />
                    </InputGroup.Text>
                    <Form.Group controlId={`properties${index}`} key={index}>
                      <Form.Control
                        type="text"
                        value={property}
                        onChange={(event) =>
                          handlePropertiesChange(index, event)
                        }
                        placeholder="Enter property"
                        autoComplete="off"
                        isValid={property.length > 0}
                        disabled={properties.length !== index + 1}
                      />
                    </Form.Group>
                    {properties.length !== index + 1 ? (
                      <div>
                        <Button
                          variant="danger"
                          //   className="py-1"
                          onClick={handleRemoveProperty}
                        >
                          -
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="success"
                          onClick={handleAddProperties}
                          //   className="py-1"
                        >
                          +
                        </Button>
                      </div>
                    )}
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter apartment equipment
                    </Form.Control.Feedback>
                  </InputGroup>
                ))}

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      isNameValid &&
                      isDescriptionValid &&
                      isAddressValid &&
                      isZipCodeValid &&
                      isSizeValid
                        ? false
                        : true
                    }
                  >
                    Create Apartment
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

export default NewApartment;
