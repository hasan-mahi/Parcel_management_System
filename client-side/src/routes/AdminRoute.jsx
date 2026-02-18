import React from "react";
import useAuth from "../hooks/authHook/useAuth";
import useUserRole from "../hooks/userRole/useUserRole";
import { Navigate } from "react-router";

const AdminRoute = ({children}) => {
  const { user, loading } = useAuth();
  const { isLoading, isAdmin } = useUserRole();

  if (loading || isLoading) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  if(!user || !isAdmin){
    return <Navigate to="/forbidden"></Navigate>;
  }

  return children;
};

export default AdminRoute;
