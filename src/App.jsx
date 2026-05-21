import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import ListOfUsers from "./pages/ListUsers";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProtectedRoute from "./Routes/ProtectedRoute";

const AppRoutes = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/home"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* <Route path="/" element={<Register />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/list-of-user" element={<ListOfUsers />} /> */}
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
