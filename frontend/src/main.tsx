import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes";
import { AlertProvider } from "./context/AlertsContext/AlertsContext";
import { UserProvider } from "./context/UserContext/UserContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertProvider>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </AlertProvider>
  </StrictMode>,
);
