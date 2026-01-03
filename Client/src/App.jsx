import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateTripPage from "./pages/CreateTripPage";
import MyTripsPage from "./pages/MyTripsPage";
import CustomTripPage from "./pages/CustomTripPage";
import CitySearchPage from "./pages/CitySearchPage";
import TripDetailPage from "./pages/TripDetailPage";
import ItineraryViewPage from "./pages/ItineraryViewPage";
import PlanTripPage from "./pages/PlanTripPage";
import CommunityPage from "./pages/CommunityPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<UserProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/custom-trip" element={<CustomTripPage />} />
        <Route path="/search" element={<CitySearchPage />} />
        <Route path="/cities" element={<CitySearchPage />} />
        <Route path="/trip/:tripId" element={<TripDetailPage />} />
        <Route path="/trip/:tripId/itinerary" element={<ItineraryViewPage />} />
        <Route path="/plan-trip" element={<PlanTripPage />} />
        <Route path="/community-tab" element={<CommunityPage />} />
      </Routes>
    </Router>
  );
}

export default App;
