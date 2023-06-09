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

const ROLES = {
  client: "ROLE_CLIENT",
  owner: "ROLE_OWNER",
  admin: "ROLE_ADMIN",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* // public routes */}
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
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

        {/* default route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
