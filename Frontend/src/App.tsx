import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Signup/SignUpPage";
import { Route, Routes } from "react-router-dom";
import VerifyOtp from "./pages/Signup/VerifyOtp";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import {
  AdminPrivateRoute,
  DriverPrivateRoute,
  UserPrivateRoute,
} from "./routes/PrivateRoutes";
import UserRoutes from "./routes/UserRoutes";
import DriverRoutes from "./routes/DriverRoutes";
import ForgotPasswordEmail from "./pages/ForgotPassword/ForgotPasswordEmail";
import NewPasswordPage from "./pages/ForgotPassword/NewPasswordPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoutes from "./routes/AdminRoutes";
import ChatComponent from "./components/chat/chatComponent";
import useSocket from "./hooks/UseSocket";
import { useEffect } from "react";
import { useEssentials } from "./hooks/UseEssentials";

function App() {
  const socket = useSocket();
  const { auth } = useEssentials();
  useEffect(() => {
    if(auth && socket && auth.user) {
      socket.emit("joinRoom",auth.user.id)
    }
    return ()=>{
      socket?.off()
    }
  }, [socket,auth,auth.user]);
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

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

      <Route path="/chat" element={<ChatComponent />} />
    </Routes>
  );
}

export default App;
