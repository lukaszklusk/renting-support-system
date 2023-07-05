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
import useAxiosUser from "../../hooks/useAxiosUser";
import useAuth from "../../hooks/useAuth";

const PRESENT_REGEX = /.+/;
const DESCRIPTION_REGEX = /^(?!(\S+\s+){101})((\S+\s+){9,100}\S+)$/;
const ZIP_CODE_REGEX = /^\d{2}-\d{3}$/;
const SIZE_REGEX = /^(?!0\d)\d{1,5}(\.\d{1,2})?$/;

const NewApartment = () => {
  const axiosUser = useAxiosUser();
  const location = useLocation();

  const nameRef = useRef();

  const { auth } = useAuth();
  const username = auth.username;
  const APARTMENT_POST_URL = `/user/${username}/apartment`;

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

  //   const [imageArray, setImageArray] = useState([""]);
  const [imageArray, setImageArray] = useState("");

  const [isPicturesValid, setIsPicturesValid] = useState(false);
  const [isFilesUpload, setIsFilesUpload] = useState(false);

  const [propertiesName, setPropertiesName] = useState([""]);
  const [propertiesDescription, setPropertiesDescription] = useState([""]);
  const [isPropertyNameValid, setIsPropertyNameValid] = useState(false);

  const [equipmentsName, setEquipmentsName] = useState([""]);
  const [equipmentsDescription, setEquipmentsDescription] = useState([""]);
  const [isEquipmentNameValid, setIsEquipmentNameValid] = useState(false);

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

  //   const handleFilesUpload = async (event) => {
  //     console.log("event");
  //     console.log(event);
  //     const files = Array.from(event.target.files);
  //     console.log("files", files);

  //     if (files) {
  //       setIsFilesUpload(true);
  //     }

  //     setIsPicturesValid(files.length > 0);

  //     console.log("Before reset", imageArray.length);
  //     console.log(imageArray);
  //     setImageArray([""]);
  //     console.log("After reset", imageArray.length);
  //     console.log(imageArray);

  //     for (const file of files) {
  //       console.log("***", file);
  //       const base64 = await convertBase64(file);
  //       //   setBase64Array(...base64Array, base64);
  //       console.log("base64", base64.length);
  //       setImageArray([...imageArray, base64]);
  //       console.log("base64Array", imageArray.length);
  //       console.log(imageArray);
  //     }
  //   };

  const handleFilesUpload = async (event) => {
    const file = event.target.files[0];
    setIsFilesUpload(true);
    if (!file) {
      setIsPicturesValid(false);
      setImageArray("");
      return;
    }
    setIsPicturesValid(true);
    console.log(file);
    // console.log("file", file);
    const base64 = await convertBase64(file);
    setImageArray(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        console.log("Error");
        reject(error);
      };
    });
  };

  const handleListChange = (
    index,
    event,
    list,
    listSetter,
    isLastListElementValidSetter = null
  ) => {
    console.log("+");
    const newValues = [...list];
    newValues[index] = event.target.value;
    listSetter(newValues);
    if (isLastListElementValidSetter) {
      isLastListElementValidSetter(PRESENT_REGEX.test(event.target.value));
    }
  };

  const handleListAdd = (
    names,
    namesSetter,
    descriptions,
    descriptionsSetter,
    isLastNameElementValidSetter
  ) => {
    namesSetter([...names, ""]);
    descriptionsSetter([...descriptions, ""]);
    isLastNameElementValidSetter(false);
  };

  const handleListRemove = (
    index,
    names,
    namesSetter,
    descriptions,
    descriptionsSetter
  ) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    namesSetter(newNames);

    const newDescriptions = [...descriptions];
    newDescriptions.splice(index, 1);
    descriptionsSetter(newDescriptions);
  };

  const createRequestEquipments = (equipmentsName, equipmentsDescription) => {
    const validNames = equipmentsName.filter((element) => element !== "");
    const validDescriptions = equipmentsDescription.filter(
      (element) => element !== ""
    );

    const requestEquipments = validNames.map((value, index) => {
      return {
        name: value,
        description: validDescriptions[index],
      };
    });
    return requestEquipments;
  };

  const createRequestProperties = (propertiesName, propertiesDescription) => {
    const validNames = propertiesName.filter((element) => element !== "");
    const validDescriptions = propertiesDescription.filter(
      (element) => element !== ""
    );

    const requestProperties = validNames.map((value, index) => {
      return {
        name: value,
        value: validDescriptions[index],
        valueType: "String",
      };
    });
    return requestProperties;
  };

  const createRequestPictures = (imageArray) => {
    const requestPictures = imageArray.map((value) => {
      return {
        name: "photo",
        image: value,
      };
    });
    return requestPictures;
  };

  const handleCreateApartment = async (e) => {
    e.preventDefault();
    console.log("To Send");

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
      const payload = JSON.stringify({
        apartmentName: name,
        description: decription,
        address: address,
        city: "city",
        postalCode: zipCode,
        size: size,
        equipment: createRequestEquipments(
          equipmentsName,
          equipmentsDescription
        ),
        properties: createRequestProperties(
          propertiesName,
          propertiesDescription
        ),
        pictures: createRequestPictures([imageArray]),
        latitude: "0",
        longitude: "0",
      });

      const response = await axiosUser.post(APARTMENT_POST_URL, payload, {
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
                <Form.Group controlId="formApartmentName" className="my-3">
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

                <Form.Group
                  controlId="formApartmentDescription"
                  className="my-3"
                >
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

                <Form.Group controlId="formApartmentAddress" className="my-3">
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

                <Form.Group controlId="formZipCode" className="my-3">
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

                <Form.Group controlId="formApartmentSize" className="my-3">
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

                <Form.Group controlId="formPictures" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <ImageFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      placeholder="Select png"
                      onChange={handleFilesUpload}
                      required
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

                {equipmentsName.map((equipmentName, index) => (
                  <InputGroup className={index === 0 && "mt-3"}>
                    <InputGroup.Text className="transparent-input-group-text">
                      <ListCheck />
                    </InputGroup.Text>
                    <div>
                      <Form.Group
                        controlId={`equipment_name_id_${index}`}
                        key={`equipment_name_key_${index}`}
                      >
                        <Form.Control
                          type="text"
                          value={equipmentName}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e,
                              equipmentsName,
                              setEquipmentsName,
                              setIsEquipmentNameValid
                            )
                          }
                          placeholder="Enter equimpent name"
                          autoComplete="off"
                          isValid={
                            equipmentsName.length !== index + 1 ||
                            isEquipmentNameValid
                          }
                          disabled={equipmentsName.length !== index + 1}
                        />
                      </Form.Group>
                      <Form.Group
                        controlId={`equipment_description_id_${index}`}
                        key={`equipment_description_key_${index}`}
                      >
                        <Form.Control
                          type="text"
                          value={equipmentsDescription[index]}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e,
                              equipmentsDescription,
                              setEquipmentsDescription
                            )
                          }
                          placeholder="Enter optional equimpent description"
                          autoComplete="off"
                          isValid={true}
                          disabled={equipmentsDescription.length !== index + 1}
                        />
                      </Form.Group>
                    </div>

                    {equipmentsName.length !== index + 1 ? (
                      <div>
                        <Button
                          variant="danger"
                          //   className="py-1"
                          onClick={() => {
                            handleListRemove(
                              index,
                              equipmentsName,
                              setEquipmentsName,
                              equipmentsDescription,
                              setEquipmentsDescription
                            );
                          }}
                        >
                          -
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="success"
                          onClick={() => {
                            handleListAdd(
                              equipmentsName,
                              setEquipmentsName,
                              equipmentsDescription,
                              setEquipmentsDescription,
                              setIsEquipmentNameValid
                            );
                          }}
                          className="mx-2"
                          disabled={!isEquipmentNameValid}
                          //   className="py-1"
                        >
                          +
                        </Button>
                      </div>
                    )}

                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter equipment equipment
                    </Form.Control.Feedback>
                  </InputGroup>
                ))}

                {propertiesName.map((propertyName, index) => (
                  <InputGroup className={index === 0 && "mt-3"}>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Tools />
                    </InputGroup.Text>
                    <div>
                      <Form.Group
                        controlId={`properties_name_id_${index}`}
                        key={`properties_name_key_${index}`}
                      >
                        <Form.Control
                          type="text"
                          value={propertyName}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e,
                              propertiesName,
                              setPropertiesName,
                              setIsPropertyNameValid
                            )
                          }
                          placeholder="Enter property name"
                          autoComplete="off"
                          isValid={
                            propertiesName.length !== index + 1 ||
                            isPropertyNameValid
                          }
                          disabled={propertiesName.length !== index + 1}
                        />
                      </Form.Group>
                      <Form.Group
                        controlId={`properties_description_id_${index}`}
                        key={`properties_description_key_${index}`}
                      >
                        <Form.Control
                          type="text"
                          value={propertiesDescription[index]}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e,
                              propertiesDescription,
                              setPropertiesDescription
                            )
                          }
                          placeholder="Enter optional property description"
                          autoComplete="off"
                          isValid={true}
                          disabled={propertiesDescription.length !== index + 1}
                        />
                      </Form.Group>
                    </div>

                    {propertiesName.length !== index + 1 ? (
                      <div>
                        <Button
                          variant="danger"
                          //   className="py-1"
                          onClick={() => {
                            handleListRemove(
                              index,
                              propertiesName,
                              setPropertiesName,
                              propertiesDescription,
                              setPropertiesDescription
                            );
                          }}
                        >
                          -
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="success"
                          onClick={() => {
                            handleListAdd(
                              propertiesName,
                              setPropertiesName,
                              propertiesDescription,
                              setPropertiesDescription,
                              setIsPropertyNameValid
                            );
                          }}
                          className="mx-2"
                          disabled={!isPropertyNameValid}
                          //   className="py-1"
                        >
                          +
                        </Button>
                      </div>
                    )}

                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter property equipment
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
                      isSizeValid &&
                      isPicturesValid
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
