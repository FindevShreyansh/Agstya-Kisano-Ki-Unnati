import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerDashboard from "./pages/FarmerDashboard";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropPlanning from "./pages/CropPlanning";
import BuyerList from "./pages/BuyerList";
import Procurement from "./pages/Procurement";
import ListCrop from "./pages/ListCrop";
import BuyerLogin from "./pages/BuyerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import PostRequirement from "./pages/PostRequirement";
import FarmerCrops from "./pages/FarmerCrops";
import BuyerProcurement from "./pages/BuyerProcurement";
import BuyerProfile from "./pages/BuyerProfile";
import FarmerNotifications from "./pages/FarmerNotifications";
import BuyerNotifications from "./pages/BuyerNotifications";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFarmers from "./pages/AdminFarmers";
import AdminBuyers from "./pages/AdminBuyers";
import AdminCropListings from "./pages/AdminCropListings";
import AdminProcurement from "./pages/AdminProcurement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roles" element={<RoleSelection />} />

      {/* Farmer Routes */}
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/register" element={<FarmerRegister />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/soil-analysis" element={<SoilAnalysis />} /> 
      <Route path="/farmer/crop-planning" element={<CropPlanning />}/>  
      <Route path="/farmer/buyers" element={<BuyerList />}/>  
      <Route path="/farmer/procurement" element={<Procurement />}/>
      <Route path="/farmer/list-crop" element={<ListCrop />}/>
      <Route path="/farmer/notifications" element={<FarmerNotifications />} />

      {/* Buyer Routes */}
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/buyer/post-requirement" element={<PostRequirement />} />
      <Route path="/buyer/crops" element={<FarmerCrops />} />
      <Route path="/buyer/procurement" element={<BuyerProcurement />} />
      <Route path="/buyer/profile" element={<BuyerProfile />} />
      <Route path="/buyer/notifications" element={<BuyerNotifications />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/farmers" element={<AdminFarmers />} />
      <Route path="/admin/buyers" element={<AdminBuyers />} />
      <Route path="/admin/crops" element={<AdminCropListings />} />
      <Route path="/admin/procurement" element={<AdminProcurement />} />
    </Routes>
  );
}

export default App;