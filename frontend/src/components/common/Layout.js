import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

const Layout = () => {
  return (
    <main className="App">
      <AppNavbar />
      <Outlet />
    </main>
  );
};

export default Layout;
