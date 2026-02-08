import React from "react";
import useAuth from "../hooks/authHook/useAuth";
import { Navigate, useLocation } from "react-router";

const PrivateRouter = ({ children }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  if (!user) {
    return <Navigate to="/login" state={pathname}></Navigate>;
  }

  return children;
};

export default PrivateRouter;
