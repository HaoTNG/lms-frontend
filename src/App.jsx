import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminPage from "./pages/admin/AdminPage";
import TutorPage from "./pages/tutor/TutorPage";
import MenteePage from "./pages/mentee/MenteePage";
import UserPage from "./pages/user/UserPage";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
}

export default App;
