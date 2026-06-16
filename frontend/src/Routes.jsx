import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// pages
import Dashboard from "./components/dashboard/Dashoard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import RepoPage from "./components/repo/RepoPage";

// Auth context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currUser, setCurrUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currUser) {
      setCurrUser(userIdFromStorage);
    }
    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }
    if (userIdFromStorage && ["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/");
    }
  }, [currUser, navigate]);

  let element = useRoutes([
    { path: "/",          element: <Dashboard /> },
    { path: "/auth",      element: <Login /> },
    { path: "/signup",    element: <Signup /> },
    { path: "/profile",   element: <Profile /> },
    { path: "/repo/:id",  element: <RepoPage /> },
  ]);

  return element;
};

export default ProjectRoutes;
