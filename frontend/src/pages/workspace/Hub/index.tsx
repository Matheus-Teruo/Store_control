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
            <Link to="/workspace/cashiers">Caixas</Link>
          </li>
        ) : (
          <li>
            <Link to="/workspace/sales">Vendas</Link>
          </li>
        )}
        <li>
          <Link to="/workspace/products">Produtos</Link>
        </li>
        <li>
          <Link to="/workspace/transaction">Transação</Link>
        </li>
        {isManegement(user) && (
          <>
            <li>
              <Link to="admin/Volunteers">Volunteers</Link>
            </li>
          </>
        )}
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
          </>
        )}
      </ul>
    </div>
  );
}

export default Hub;
