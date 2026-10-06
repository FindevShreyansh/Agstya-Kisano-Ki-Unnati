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

      {/* Buyer Routes */}
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/buyer/post-requirement" element={<PostRequirement />} />
      <Route path="/buyer/crops" element={<FarmerCrops />} />
      <Route path="/buyer/procurement" element={<BuyerProcurement />} />
      <Route path="/buyer/profile" element={<BuyerProfile />} />
    </Routes>
  );
}

export default App;