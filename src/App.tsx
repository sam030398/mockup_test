import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DataEntryPage } from "./pages/DataEntryPage";
import { MapPage } from "./pages/MapPage";
import { RegionDetailPage } from "./pages/RegionDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AppShell />}>
          <Route path="map" element={<MapPage />} />
          <Route path="region/:regionId" element={<RegionDetailPage />} />
          <Route path="data-entry" element={<DataEntryPage />} />
          <Route index element={<Navigate to="/dashboard/map" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/map" replace />} />
    </Routes>
  );
}
