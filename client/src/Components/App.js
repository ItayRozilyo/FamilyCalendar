import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Calendar from "./Calendar";
import Login from "./Login";
import Register from "./Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />{" "}
        {/* Render Register component first */}
        <Route path="/login" element={<Login />} />{" "}
        {/* Render Login component */}
        <Route path="/home" element={<Home />} /> {/* Render Home component */}
        <Route path="/calendar" element={<Calendar />} />{" "}
        {/* Render Calendar component */}
      </Routes>
    </Router>
  );
}

export default App;
