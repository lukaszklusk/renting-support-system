import { Routes, Route } from "react-router-dom";

import { ROLES } from "./config/roles";

import useData from "./hooks/useData";

import Layout from "./components/common/Layout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";

import Register from "./components/common/auth/Register";
import Login from "./components/common/auth/Login";
import RequireAuth from "./components/common/auth/RequireAuth";

import OwnerDashboard from "./pages/secured/Dashboard";
import OwnerApartments from "./pages/secured/Apartments";
import OwnerAgreements from "./pages/secured/Agreements";
import NewApartment from "./pages/secured/owner/NewApartment";
import OwnerReports from "./components/owner/OwnerReports";
import OwnerApartmentDetails from "./pages/secured/ApartmentDetails";
import AddAgreement from "./pages/secured/owner/NewAgreement";

import AdminDashboard from "./components/admin/AdminDashboard";
import OwnerAgreementDetails from "./pages/secured/AgreementDetails";

import SendMessage from "./components/common/communication/SendMessage";
import Notifications from "./components/common/communication/Notifications";

function App() {
  const { isClient, isOwner, isAdmin } = useData();

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
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="apartments" element={<OwnerApartments />} />
            <Route path="apartments/:id" element={<OwnerApartmentDetails />} />
            <Route path="agreements" element={<OwnerAgreements />} />
            <Route path="agreements/:id" element={<OwnerAgreementDetails />} />
            <Route path="chat" element={<SendMessage />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        {/* owner secured routes */}
        {isOwner && (
          <Route element={<RequireAuth roles={[ROLES.owner]} />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route exact path="apartments" element={<OwnerApartments />} />
            <Route path="apartments/:id" element={<OwnerApartmentDetails />} />
            <Route path="apartments/new" element={<NewApartment />} />
            <Route path="agreements" element={<OwnerAgreements />} />
            <Route path="agreements/:id" element={<OwnerAgreementDetails />} />
            <Route path="agreements/new" element={<AddAgreement />} />
            <Route path="reports" element={<OwnerReports />} />
            <Route path="chat" element={<SendMessage />} />
            <Route path="notifications" element={<Notifications />} />
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
