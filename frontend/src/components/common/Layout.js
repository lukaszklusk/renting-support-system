import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";

import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

import "../../styles/custom-styles.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useData from "../../hooks/useData";

const Layout = () => {
  const { errMsg, successMsg } = useData();

  useEffect(() => {
    console.log("rendering!");
  }, []);

  return (
    <main className="App">
      <AppNavbar />
      <Container className="main-component">
        {errMsg && <Alert variant="danger">{errMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <ToastContainer />
        <Outlet />
      </Container>
      <Footer />
    </main>
  );
};

export default Layout;
