import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";
import "../../styles/custom-styles.css";

const Layout = () => {
  return (
    <main className="App">
      <AppNavbar />
      <div className="main-component">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
