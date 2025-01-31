import {
  isAdmin,
  isManegement,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function HubSimple() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div>
      <div>header</div>
      <ul>
        {isUserLogged(user) &&
          isSeller(user.summaryFunction, user.voluntaryRole) && (
            <li>
              <Link to="/workspace/sales">Vendas</Link>
            </li>
          )}
        <li>
          <Link to="/workspace/products">Produtos</Link>
        </li>
        {isManegement(user) && (
          <>
            <li>
              <Link to="/admin/volunteers">Volunteers</Link>
            </li>
          </>
        )}
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
      </ul>
    </div>
  );
}

export default HubSimple;
