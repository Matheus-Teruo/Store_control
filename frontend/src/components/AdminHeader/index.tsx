import { isAdmin } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function AdminHeader() {
  const { user } = useUserContext();

  return (
    <div>
      <ul>
        {isAdmin(user) && (
          <>
            <li>
              <Link to="/admin/associations">Associations</Link>
            </li>
            <li>
              <Link to="/admin/cards">Cards</Link>
            </li>
            <li>
              <Link to="/admin/stands">Stands</Link>
            </li>
          </>
        )}

        <li>
          <Link to="/admin/volunteers">Volunteers</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default AdminHeader;
