import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/Common/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./lib/context/SocketContext.tsx";

const GoogleAPI = import.meta.env.VITE_API_GOOGLE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <GoogleOAuthProvider clientId={GoogleAPI}>
      <Provider store={store}>
        <SocketProvider>
          <BrowserRouter>
            <Toaster position="top-center" />
            <App />
          </BrowserRouter>
        </SocketProvider>
      </Provider>
    </GoogleOAuthProvider>
  </ThemeProvider>
);
