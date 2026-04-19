import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
