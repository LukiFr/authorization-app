import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import AdminPanel from "./components/AdminPanel/AdminPanel.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx";
import AppNavbar from "./components/AppNavbar/AppNavbar.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
