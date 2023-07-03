import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Envelope, Person, Gear, Lock, Key } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import "../../../styles/custom-styles.css";
import axios from "../../../services/axios";

const REGISTER_URL = "/sign-up";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const emailRef = useRef();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const [role, setRole] = useState("client");

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRepeatPasswordValid, setIsRepeatPasswordValid] = useState(false);

  const [isAgreeTerms, setIsAgreeTerms] = useState(false);

  const [submitMsg, setSubmitMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, username, password, repeatPassword]);

  useEffect(() => {
    const isValid = EMAIL_REGEX.test(email);
    console.log(isValid);
    console.log(email);
    setIsEmailValid(isValid);
  }, [email]);

  useEffect(() => {
    const isValid = USERNAME_REGEX.test(username);
    console.log(isValid);
    console.log(username);
    setIsUsernameValid(isValid);
  }, [username]);

  useEffect(() => {
    const isValid = PASSWORD_REGEX.test(password);
    console.log(isValid);
    console.log(password);
    setIsPasswordValid(isValid);
    const isRepetead = password == repeatPassword;
    setIsRepeatPasswordValid(isRepetead);
  }, [password, repeatPassword]);

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (
      !EMAIL_REGEX.test(email) ||
      !USERNAME_REGEX.test(username) ||
      !PASSWORD_REGEX.test(password)
    ) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email, username, role, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setSubmitMsg("Activation link sent to an email");
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
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-5">Sign Up</Card.Title>
              {errMsg && <Alert variant="danger">{errMsg}</Alert>}
              {submitMsg && <Alert variant="success">{submitMsg}</Alert>}
              <Form onSubmit={handleRegistration}>
                <Form.Group controlId="formEmail" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Envelope />
                    </InputGroup.Text>
                    <Form.Control
                      ref={emailRef}
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isEmailValid}
                      isInvalid={email && !isEmailValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter a valid email address
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formUsername" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Person />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="off"
                      isValid={isUsernameValid}
                      isInvalid={username && !isUsernameValid}
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

                <Form.Group controlId="formRole" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Gear />
                    </InputGroup.Text>
                    <div className="d-flex justify-content-between flex-grow-1 align-items-end">
                      <Form.Check
                        type="radio"
                        id="client"
                        label="client"
                        value="client"
                        checked={role === "client"}
                        onChange={(e) => setRole(e.target.value)}
                        className="custom-radio-input w-100"
                      />
                      <Form.Check
                        type="radio"
                        id="owner"
                        label="owner"
                        value="owner"
                        checked={role === "owner"}
                        onChange={(e) => setRole(e.target.value)}
                        className="custom-radio-input w-100"
                      />
                    </div>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPassword" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Lock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      isValid={isPasswordValid}
                      isInvalid={password && !isPasswordValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Please enter a password with following restrictions:
                      <br />
                      - between 8 and 24 characters <br />- at least one
                      lowercase letter, uppercase letter, number and special
                      character
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formRepeatPassword" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <Key />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Repeat password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                      isValid={repeatPassword && isRepeatPasswordValid}
                      isInvalid={repeatPassword && !isRepeatPasswordValid}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-5">
                      Passwords do not match
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group
                  controlId="termsCheckbox"
                  className="my-3 d-flex justify-content-end"
                >
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms and conditions"
                    checked={isAgreeTerms}
                    onChange={(e) => setIsAgreeTerms(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      isEmailValid &&
                      isUsernameValid &&
                      isPasswordValid &&
                      isRepeatPasswordValid &&
                      isAgreeTerms
                        ? false
                        : true
                    }
                  >
                    Sign Up
                  </Button>
                </div>
              </Form>

              <Row className="mt-2">
                <p className="text-start mb-0">
                  Already registered? <br />
                  <span className="line">
                    <Link to="/sign-in">Sign In</Link>
                  </span>
                </p>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
