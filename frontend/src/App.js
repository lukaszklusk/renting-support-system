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

import Dashboard from "./pages/secured/Dashboard";
import Apartments from "./pages/secured/Apartments";
import Agreements from "./pages/secured/Agreements";
import NewApartment from "./pages/secured/owner/NewApartment";
import Reports from "./pages/secured/owner/Reports";
import ApartmentDetails from "./pages/secured/ApartmentDetails";
import AddAgreement from "./pages/secured/owner/NewAgreement";

import AdminDashboard from "./components/admin/AdminDashboard";
import AgreementDetails from "./pages/secured/AgreementDetails";

import Chat from "./components/common/communication/Chat";
import Notifications from "./components/common/communication/Notifications";

import Payments from "./pages/secured/Payments";
import PaymentsDetails from "./pages/secured/PaymentsDetails";

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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="apartments" element={<Apartments />} />
            <Route path="apartments/:id" element={<ApartmentDetails />} />
            <Route
              key="apartment-payments"
              path="apartments/:id/payments"
              element={<PaymentsDetails />}
            />
            <Route path="agreements" element={<Agreements />} />
            <Route path="agreements/:id" element={<AgreementDetails />} />
            <Route path="payments" element={<Payments />} />
            <Route path="chat" element={<Chat />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        {/* owner secured routes */}
        {isOwner && (
          <Route element={<RequireAuth roles={[ROLES.owner]} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route exact path="apartments" element={<Apartments />} />
            <Route path="apartments/:id" element={<ApartmentDetails />} />
            <Route
              key="apartment-agreements"
              path="apartments/:apartmentId/agreements"
              element={<Agreements />}
            />
            <Route
              key="apartment-payments"
              path="apartments/:id/payments"
              element={<PaymentsDetails />}
            />
            <Route path="apartments/new" element={<NewApartment />} />
            <Route
              key="agreements"
              path="agreements"
              element={<Agreements />}
            />
            <Route path="agreements/:id" element={<AgreementDetails />} />
            <Route path="agreements/new" element={<AddAgreement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="payments" element={<Payments />} />
            <Route path="chat" element={<Chat />} />
            <Route path="notifications/*" element={<Notifications />} />
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
