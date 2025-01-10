import {
  isAdmin,
  isCashier,
  isManegement,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Hub() {
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
        {isUserLogged(user) && isCashier(user.summaryFunction) ? (
          <li>
            <Link to="/cashiers">Caixas</Link>
          </li>
        ) : (
          <li>
            <Link to="/sales">Vendas</Link>
          </li>
        )}
        <li>
          <Link to="/products">Produtos</Link>
        </li>
        {isManegement(user) && <div>sessão gerente</div>}
        {isAdmin(user) && (
          <>
            <li>
              <Link to="admin/associations">Associations</Link>
            </li>
            <li>
              <Link to="admin/cards">Cards</Link>
            </li>
            <li>
              <Link to="admin/Stands">Stands</Link>
            </li>
            <li>
              <Link to="admin/Volunteers">Volunteers</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Hub;
