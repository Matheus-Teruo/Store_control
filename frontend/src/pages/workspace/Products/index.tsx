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
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProduct from "./FormProduct";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import Button from "@/components/utils/Button";
import { formReducer, initialFormState } from "@reducer/formReducer";

function Products() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
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
  }, [user, page.number, modeAdmin, navigate, handleApiError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdmin = () => {
    setModeAdmin((prev) => !prev.valueOf);
  };

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchProducts();
  };

  return (
    <div>
      <div>page</div>
      <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
        Criar Produto
      </Button>
      {isAdmin(user) && (
        <div onClick={handleAdmin}>{modeAdmin ? "Normal" : "Admin"}</div>
      )}
      <div>
        {products.map((product) => (
          <>
            <div>
              {
                product.productImg ? <img src={product.productImg} /> : <></>
                // futuramente usar SVG padrão
              }
            </div>
            <div>
              <p>{product.productName}</p>
              <p>Preço R${product.price.toFixed(2)}</p>
              <p>Desconto R${product.discount.toFixed(2)}</p>
              <p>Estoque: {product.stock}</p>
            </div>
            <div
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: product.uuid })
              }
            >
              Editar
            </div>
          </>
        ))}
      </div>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <>
          <FormProduct
            type={formState.type}
            hide={handleFormShow}
            uuid={formState.uuid}
          />
          <div onClick={() => formDispach({ type: "SET_FALSE" })} />
        </>
      )}
    </div>
  );
}

export default Products;
