import { useHandleApiError } from "@/axios/handlerApiError";
import {
  hasFunction,
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
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user) && hasFunction(user.summaryFunction)) {
        try {
          const response = await getProducts(undefined, undefined, page);
          setProducts(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !hasFunction(user.summaryFunction))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, page, navigate, handleApiError]);
  return (
    <div>
      <div>page</div>
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
