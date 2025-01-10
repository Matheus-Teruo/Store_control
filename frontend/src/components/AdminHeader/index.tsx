import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function AdminHeader() {
  return (
    <div>
      <ul>
        <li>
          <Link to="admin/associations">Associations</Link>
        </li>
        <li>
          <Link to="admin/cards">Cards</Link>
        </li>
        <li>
          <Link to="admin/stands">Stands</Link>
        </li>
        <li>
          <Link to="admin/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="admin/volunteers">Volunteers</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default AdminHeader;
