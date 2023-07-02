import { Routes, Route } from "react-router-dom";

import { ROLES } from "./config/roles";

import useAuth from "./hooks/useAuth";

import Layout from "./components/common/Layout";
import Home from "./components/common/Home";
import About from "./components/common/About";
import Contact from "./components/common/Contact";
import NotFound from "./components/common/NotFound";

import Register from "./components/common/auth/Register";
import Login from "./components/common/auth/Login";
import RequireAuth from "./components/common/auth/RequireAuth";

import OwnerDashboard from "./components/owner/OwnerDashboard";
import OwnerApartments from "./components/owner/OwnerApartments";
import OwnerAgreements from "./components/owner/OwnerAgreements";
import OwnerReports from "./components/owner/OwnerReports";
import OwnerApartmentDetails from "./components/owner/OwnerApartmentDetails";

import ClientDashboard from "./components/client/ClientDashboard";
import ClientAgreement from "./components/client/ClientAgreement";
import ClientApartment from "./components/client/ClientApartment";

import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const { auth } = useAuth();
  const isLoggedIn = auth.isLoggedIn;
  const isClient = isLoggedIn && auth.roles?.includes(ROLES.client);
  const isOwner = isLoggedIn && auth.roles?.includes(ROLES.owner);
  const isAdmin = isLoggedIn && auth.roles?.includes(ROLES.admin);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* // public routes */}
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="sign-up" element={<Register />} />
        <Route path="sign-in" element={<Login />} />

        {/* client secured routes */}
        {isClient && (
          <Route element={<RequireAuth roles={[ROLES.client]} />}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="apartment" element={<ClientApartment />} />
            <Route path="agreement" element={<ClientAgreement />} />
          </Route>
        )}

        {/* owner secured routes */}
        {isOwner && (
          <Route element={<RequireAuth roles={[ROLES.owner]} />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route exact path="apartments" element={<OwnerApartments />} />
            <Route path="apartments/:id" element={<OwnerApartmentDetails />} />
            <Route path="agreements" element={<OwnerAgreements />} />
            <Route path="reports" element={<OwnerReports />} />
          </Route>
        )}

        {/* admin secured routes */}
        {isAdmin && (
          <Route element={<RequireAuth roles={[ROLES.admin]} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        )}

        {/* default route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
