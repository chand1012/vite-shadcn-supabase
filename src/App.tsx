import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "@/routes/login";
import RegisterPage from "@/routes/register";
import RootPage from "@/routes/root";
import PricingPage from "./routes/pricing";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "@/components/navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
