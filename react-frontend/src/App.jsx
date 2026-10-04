import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerDashboard from "./pages/FarmerDashboard";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropPlanning from "./pages/CropPlanning";
import BuyerList from "./pages/BuyerList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roles" element={<RoleSelection />} />

      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/register" element={<FarmerRegister />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/soil-analysis" element={<SoilAnalysis />} /> 
      <Route path="/farmer/crop-planning" element={<CropPlanning />}/>  
      <Route path="/farmer/buyers" element={<BuyerList />}/>  
    </Routes>
  );
}

export default App;