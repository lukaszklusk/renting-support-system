import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

import "../../styles/custom-styles.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <main className="App">
      <AppNavbar />
      <Container className="main-component">
        <ToastContainer />
        <Outlet />
      </Container>
      <Footer />
    </main>
  );
};

export default Layout;
