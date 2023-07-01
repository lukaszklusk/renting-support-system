import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../config/roles";
import useLogout from "../../hooks/useLogout";

const AppNavbar = () => {
  const { auth } = useAuth();
  const isLoggedIn = auth.isLoggedIn;
  const isClient = isLoggedIn && auth.roles?.includes(ROLES.client);
  const isOwner = isLoggedIn && auth.roles?.includes(ROLES.owner);
  const isAdmin = isLoggedIn && auth.roles?.includes(ROLES.admin);
  const logout = useLogout();

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand as={Link} to="/" className="custom-navbar-link">
        RentSys
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav>
          {isLoggedIn ? (
            <>
              <Nav.Link as={Link} to="dashboard" className="custom-navbar-link">
                Dashboard
              </Nav.Link>

              {isClient && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/apartment"
                    className="custom-navbar-link"
                  >
                    Apartment
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/agreement"
                    className="custom-navbar-link"
                  >
                    Agreement
                  </Nav.Link>
                </>
              )}

              {isOwner && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/apartments"
                    className="custom-navbar-link"
                  >
                    Apartments
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/agreements"
                    className="custom-navbar-link"
                  >
                    Agreements
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/reports"
                    className="custom-navbar-link"
                  >
                    Reports
                  </Nav.Link>
                </>
              )}

              <Nav.Link
                as={Link}
                to="sign-in"
                className="custom-navbar-link"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/" className="custom-navbar-link">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="custom-navbar-link">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="custom-navbar-link">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/sign-up" className="custom-navbar-link">
                Sign Up
              </Nav.Link>
              <Nav.Link as={Link} to="/sign-in" className="custom-navbar-link">
                Sign In
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
