import {
  isAdmin,
  isManegement,
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
        <li>
          <Link to="/sales">Vendas</Link>
        </li>
        <li>
          <Link to="/cashiers">Caixas</Link>
        </li>
        <li>
          <Link to="/products">Produtos</Link>
        </li>
        {isManegement(user) && <div>sessão gerente</div>}
        {isAdmin(user) && <div>sessão admin</div>}
      </ul>
    </div>
  );
}

export default Hub;
