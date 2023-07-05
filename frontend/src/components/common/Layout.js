import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./AppNavbar";
import Footer from "./Footer";
import "../../styles/custom-styles.css";

const Layout = () => {
  return (
    <main className="App">
      <AppNavbar />
      <Container className="main-component">
        <Outlet />
      </Container>
      <Footer />
    </main>
  );
};

export default Layout;
