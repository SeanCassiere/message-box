import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../shared/hooks/usePermission";

interface RequireAuthProps {
  requiredPermission: string;
}

/**
 * @description A route that requires the user to have a requiredPermission from their access token.
 * @param requiredPermission: string
 * @returns <Outlet /> or <Navigate to="/not-found" />
 */
const RequirePermission = ({ requiredPermission }: RequireAuthProps) => {
  const hasPermission = usePermission(requiredPermission);
  return hasPermission ? <Outlet /> : <Navigate to="/not-found" replace />;
};

export default RequirePermission;
