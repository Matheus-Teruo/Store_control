import { useHandleApiError } from "@/axios/handlerApiError";
import {
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { getProducts } from "@service/stand/productService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Stand() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, setPage] = useState<number>(0);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        try {
          const response = await getProducts(
            undefined,
            user.summaryFunction.uuid,
            page,
          );
          setProducts(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction, user.voluntaryRole))
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

export default Stand;
