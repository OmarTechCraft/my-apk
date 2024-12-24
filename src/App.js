import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import DashboardPage from "./pages/DashBoardPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for the login page */}
        <Route path="/dash" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reg" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
