import { Routes, Route } from "react-router-dom";

import { ROLES } from "./config/roles";

import useData from "./hooks/useData";

import Layout from "./components/common/Layout";
import Home from "./components/common/Home";
import About from "./components/common/About";
import Contact from "./components/common/Contact";
import NotFound from "./components/common/NotFound";

import Register from "./components/common/auth/Register";
import Login from "./components/common/auth/Login";
import RequireAuth from "./components/common/auth/RequireAuth";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerApartments from "./pages/owner/OwnerApartments";
import OwnerAgreements from "./pages/owner/OwnerAgreements";
import NewApartment from "./pages/owner/NewApartment";
import OwnerReports from "./components/owner/OwnerReports";
import OwnerApartmentDetails from "./pages/owner/OwnerApartmentDetails";
import AddAgreement from "./pages/owner/AddAgreement";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientAgreements from "./pages/client/ClientAgreements";
import ClientApartments from "./pages/client/ClientApartments";

import AdminDashboard from "./components/admin/AdminDashboard";
import OwnerAgreementDetails from "./pages/owner/OwnerAgreementDetails";

import FileUploadForm from "./pages/owner/MyForm";

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
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="apartments" element={<ClientApartments />} />
            <Route path="apartments/:id" element={<OwnerApartmentDetails />} />
            <Route path="agreements" element={<ClientAgreements />} />
            <Route path="agreements/:id" element={<OwnerAgreementDetails />} />
            <Route path="chat" element={<SendMessage />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        {/* owner secured routes */}
        {isOwner && (
          <Route element={<RequireAuth roles={[ROLES.owner]} />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route exact path="test" element={<FileUploadForm />} />
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
