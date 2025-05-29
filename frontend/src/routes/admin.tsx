import AdminHeader from "@/components/pagePieces/AdminHeader";
import Associations from "@/pages/admin/Associations";
import Cards from "@/pages/admin/Cards";
import Stands from "@/pages/admin/Stands";
import Tags from "@/pages/admin/Tags";
import Volunteers from "@/pages/admin/Volunteers";
import { Route, Routes } from "react-router-dom";

function AdminRoutesComponent() {
  return (
    <Routes>
      <Route path="tags" element={<Tags />} />
      <Route path="" element={<AdminHeader />}>
        <Route path="associations" element={<Associations />} />
        <Route path="cards" element={<Cards />} />
        <Route path="stands" element={<Stands />} />
        <Route path="volunteers" element={<Volunteers />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutesComponent;
