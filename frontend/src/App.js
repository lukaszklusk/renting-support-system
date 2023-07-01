import { Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Layout from "./components/Layout";
import Home from "./components/Home";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Apartments from "./components/Apartments";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/auth/RequireAuth";
import Contact from "./components/Contact";
import Agreements from "./components/Agreements";
import { ROLES } from "./config/roles";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* // public routes */}
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="sign-up" element={<Register />} />
        <Route path="sign-in" element={<Login />} />

        {/* secured routes */}
        <Route
          element={
            <RequireAuth roles={[ROLES.client, ROLES.owner, ROLES.admin]} />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.owner, ROLES.admin]} />}>
          <Route path="apartments" element={<Apartments />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.owner, ROLES.admin]} />}>
          <Route path="agreements" element={<Agreements />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.owner, ROLES.admin]} />}>
          <Route path="reports" element={<Apartments />} />
        </Route>

        {/* default route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
