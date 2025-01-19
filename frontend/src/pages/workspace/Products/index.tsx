import { useHandleApiError } from "@/axios/handlerApiError";
import {
  isAdmin,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { getProducts } from "@service/stand/productService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, setPage] = useState<number>(0);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user) && isSeller(user.summaryFunction)) {
        try {
          const response = await getProducts(
            undefined,
            modeAdmin ? undefined : user.summaryFunction.uuid,
            page,
          );
          setProducts(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, page, modeAdmin, navigate, handleApiError]);

  const handleAdmin = () => {
    setModeAdmin((prev) => !prev.valueOf);
  };

  return (
    <div>
      <div>page</div>
      {isAdmin(user) && (
        <div onClick={handleAdmin}>{modeAdmin ? "Normal" : "Admin"}</div>
      )}
      <div>
        {products.map((product) => (
          <div key={product.uuid}>{product.productName}</div>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default Products;
