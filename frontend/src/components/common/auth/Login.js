import { useRef, useState, useEffect } from "react";
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
import { PersonFill, LockFill } from "react-bootstrap-icons";
import axios from "../../../services/axios";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/sign-in";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const usernameRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUsername("");
      setPassword("");
      const roles = response?.data?.roles;
      setAuth({ username, roles, isLoggedIn: true });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server did not respond");
      } else {
        setErrMsg("Signing in failed");
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-5">Sign In</Card.Title>
              {errMsg && <Alert variant="danger">{errMsg}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <PersonFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      ref={usernameRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPassword" className="my-3">
                  <InputGroup>
                    <InputGroup.Text className="transparent-input-group-text">
                      <LockFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={username && password ? false : true}
                  >
                    Sign In
                  </Button>
                </div>
              </Form>

              <Row className="mt-2">
                <p className="text-start mb-0">
                  Need an Account? <br />
                  <span className="line">
                    <Link to="/sign-up">Sign Up</Link>
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

export default Login;
