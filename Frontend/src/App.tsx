import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Signup/SignUpPage";
import { Route, Routes } from "react-router-dom";
import VerifyOtp from "./pages/Signup/VerifyOtp";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import { AdminPrivateRoute, DriverPrivateRoute, UserPrivateRoute } from "./routes/PrivateRoutes";
import UserRoutes from "./routes/UserRoutes";
import DriverRoutes from "./routes/DriverRoutes";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordEmail from "./pages/ForgotPassword/ForgotPasswordEmail";
import NewPasswordPage from "./pages/ForgotPassword/NewPasswordPage";
import DriverProfile from "./pages/Driver/Driver Profile/DriverProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/driver-profile" element={<DriverProfile />} />
      <Route path="/" element={<Home />} />
      <Route path="/verifyotp" element={<VerifyOtp />} />
      <Route path="/forgotpassword" element={<ForgotPasswordEmail />} />
      <Route path="/forgotpassword/newpassword" element={<NewPasswordPage />} />

      {/* User Routes */}
      <Route element={<UserPrivateRoute />}>
        <Route path="/user/*" element={<UserRoutes />} />
      </Route>

      {/* Admin private routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* Driver private routes */}
      <Route element={<DriverPrivateRoute />}>
        <Route path="/driver/*" element={<DriverRoutes />} />
      </Route>
    </Routes>
  );
}

export default App;
