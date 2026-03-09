import { BrowserRouter, Routes, Route } from "react-router-dom";

import LiveTracking from "../pages/share/LiveTracking";
import TrackingViewer from "../pages/track/TrackingViewer";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LiveTracking />} />
        <Route path="/track/view" element={<TrackingViewer/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;