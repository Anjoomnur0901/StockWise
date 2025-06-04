import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InventoryPage from "./pages/InventoryPage";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>

    </Router>
  );
}

export default App;
