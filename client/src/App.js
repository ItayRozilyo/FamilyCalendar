import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home"; // Import the Home component
import Calendar from "./Components/Calendar"; // Ensure you have a main component to render

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        {/* Render Home component first */}
        <Route path="/calendar" element={<Calendar />} />{" "}
        {/* Render Calendar component */}
      </Routes>
    </Router>
  );
}

export default App;
