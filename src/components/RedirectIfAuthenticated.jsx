import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RedirectIfAuthenticated = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  const authToken = localStorage.getItem("authToken");

  if (userToken) {
    return <Navigate to="/" replace />;
  }

  if (authToken) {
    try {
      const decoded = jwtDecode(authToken);
      if (decoded.isAdmin) {
        return <Navigate to="/admin" replace />;
      }
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  }

  return children;
};

export default RedirectIfAuthenticated;