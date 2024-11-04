import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/hooks/use-supabase";

import LoginPage from "@/routes/login";
import DashboardPage from "@/routes/dashboard";
import RegisterPage from "@/routes/register";
import RootPage from "@/routes/root";
import PricingPage from "@/routes/pricing";
import AccountPage from "@/routes/account";
import AboutUsPage from "@/routes/about";
import OnboardingWizard from "@/routes/onboarding";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SupabaseProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </Router>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;
