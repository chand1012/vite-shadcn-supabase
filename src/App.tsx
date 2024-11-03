import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "@/routes/login";
import DashboardPage from "./routes/dashboard";
import RegisterPage from "@/routes/register";
import RootPage from "@/routes/root";
import PricingPage from "@/routes/pricing";
import AccountPage from "@/routes/account";
import AboutUsPage from "@/routes/about";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
