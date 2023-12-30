import { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useData from "../../hooks/useData";
import useLogout from "../../hooks/useLogout";

const AppNavbar = () => {
  const location = useLocation();

  const { isLoggedIn, isClient, isOwner, isAdmin } = useData();

  const logout = useLogout();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentPath = location.pathname;
    currentPath.length > 0 && setActiveLink(currentPath.substring(1));
  }, [location]);

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand
        as={Link}
        to={isLoggedIn ? "dashboard" : "/"}
        className="custom-navbar-link"
      >
        RentSys
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav>
          {isLoggedIn ? (
            <>
              <Nav.Link
                as={Link}
                to="/apartments"
                className={`custom-navbar-link ${
                  activeLink === "apartments" ? "active" : ""
                }`}
              >
                Apartments
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/agreements"
                className={`custom-navbar-link ${
                  activeLink === "agreements" ? "active" : ""
                }`}
              >
                Agreements
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/payments"
                className={`custom-navbar-link ${
                  activeLink === "payments" ? "active" : ""
                }`}
              >
                Payments
              </Nav.Link>

              {isOwner && (
                <Nav.Link
                  as={Link}
                  to="/reports"
                  className={`custom-navbar-link ${
                    activeLink === "reports" ? "active" : ""
                  }`}
                >
                  Reports
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/chat"
                className={`custom-navbar-link ${
                  activeLink === "chat" ? "active" : ""
                }`}
              >
                Chat
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/notifications"
                className={`custom-navbar-link ${
                  activeLink === "notifications" ? "active" : ""
                }`}
              >
                Notifications
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="sign-in"
                className={`custom-navbar-link ${
                  activeLink === "sign-in" ? "active" : ""
                }`}
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/about"
                className={`custom-navbar-link ${
                  activeLink === "about" ? "active" : ""
                }`}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={`custom-navbar-link ${
                  activeLink === "contact" ? "active" : ""
                }`}
              >
                Contact
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/sign-up"
                className={`custom-navbar-link ${
                  activeLink === "sign-up" ? "active" : ""
                }`}
              >
                Sign Up
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/sign-in"
                className={`custom-navbar-link ${
                  activeLink === "sign-in" ? "active" : ""
                }`}
              >
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
