import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "@/routes/login";
import RegisterPage from "@/routes/register";
import RootPage from "@/routes/root";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
