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
import CUDProduct from "./CUDProduct";
import { initialPageState, pageReducer } from "@reducer/pageReducer";

interface CRUDState {
  show: boolean;
  type: "create" | "update";
  uuid?: string;
}

const initialCRUDState: CRUDState = {
  show: false,
  type: "create",
  uuid: undefined,
};

function Products() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [CRUDProduct, setCRUDProduct] = useState<CRUDState>(initialCRUDState);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchVoluntary = useCallback(async () => {
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
  }, [user, page, modeAdmin, navigate, handleApiError]);

  useEffect(() => {
    fetchVoluntary();
  }, [fetchVoluntary]);

  const handleAdmin = () => {
    setModeAdmin((prev) => !prev.valueOf);
  };

  const handleCRUDShow = () => {
    setCRUDProduct({ ...CRUDProduct, show: false });
    fetchVoluntary();
  };

  return (
    <div>
      <div>page</div>
      <button onClick={() => setCRUDProduct({ show: true, type: "create" })}>
        Create Product
      </button>
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
                setCRUDProduct({
                  show: true,
                  type: "update",
                  uuid: product.uuid,
                })
              }
            >
              Editar
            </div>
          </>
        ))}
      </div>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {CRUDProduct.show && (
        <>
          <CUDProduct
            type={CRUDProduct.type}
            show={handleCRUDShow}
            uuid={CRUDProduct.uuid}
          />
          <div
            onClick={() => setCRUDProduct({ ...CRUDProduct, show: false })}
          />
        </>
      )}
    </div>
  );
}

export default Products;
