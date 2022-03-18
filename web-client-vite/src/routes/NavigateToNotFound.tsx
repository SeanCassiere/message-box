import { useLocation, Navigate } from "react-router-dom";

const NavigateToNotFound = () => {
  const location = useLocation();
  return <Navigate to="/not-found" state={{ from: location }} replace />;
};

export default NavigateToNotFound;
