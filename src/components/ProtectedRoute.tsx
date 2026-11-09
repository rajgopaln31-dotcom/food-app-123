import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppSelector } from "../hooks";
import Header from "./Header";
import Footer from "./Footer";

// If the user is not logged in, go to Login. Otherwise show Header + page + Footer.
function ProtectedRoute() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  if (currentUser === null) return <Navigate to="/" />;
  return (
    <>
      <Header />
      <Box className="page"><Outlet /></Box>
      <Footer />
    </>
  );
}
export default ProtectedRoute;
