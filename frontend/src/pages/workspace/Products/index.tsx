import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import {
  isAdmin,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { getProducts } from "@service/stand/productService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import CUDProduct from "./CUDProduct";
import { initialPageState, pageReducer } from "@reducer/pageReducer";

function Products() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [createProduct, setCreateProduct] = useState<boolean>(false);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
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
            modeAdmin ? user.summaryFunction.uuid : undefined,
            page.number,
          );
          setProducts(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction, user.voluntaryRole))
      ) {
        console.log(isSeller);
        navigate("/login");
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
      <button onClick={() => setCreateProduct(true)}>Create Product</button>
      {isAdmin(user) && (
        <div onClick={handleAdmin}>{modeAdmin ? "Normal" : "Admin"}</div>
      )}
      <div>
        {products.map((product) => (
          <div key={product.uuid}>{product.productName}</div>
        ))}
      </div>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {createProduct && (
        <>
          <CUDProduct />
          <div onClick={() => setCreateProduct(false)} />
        </>
      )}
    </div>
  );
}

export default Products;
