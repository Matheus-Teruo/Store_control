import PageSelect from "@/components/selects/PageSelect";
import {
  isAdmin,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProduct from "./FormProduct";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import Button from "@/components/utils/Button";
import { formReducer, initialFormState } from "@reducer/formReducer";
import StandSelect from "@/components/selects/StandSelect";

function Products() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const [selectedStand, setSelectedStand] = useState<string | undefined>();
  const { getProducts } = useProductService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchProducts = useCallback(
    async (requestMode: boolean) => {
      if (
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        const response = await getProducts(
          undefined,
          requestMode ? selectedStand : user.summaryFunction.uuid,
          page.number,
        );
        if (response) {
          setProducts(response.content);
        }
      }
    },
    [user, page.number, selectedStand, getProducts],
  );

  useEffect(() => {
    const admin = isAdmin(user) && user.summaryFunction === null;
    if (isAdmin(user)) if (!admin) setSelectedStand(user.summaryFunction!.uuid);
    setModeAdmin(admin);
    fetchProducts(admin);
    if (
      isUserUnlogged(user) ||
      (user && !isSeller(user.summaryFunction, user.voluntaryRole))
    ) {
      navigate("/");
    }
  }, [user, navigate, fetchProducts]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchProducts(modeAdmin);
  };

  return (
    <div>
      <div>page</div>
      <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
        Criar Produto
      </Button>
      {isAdmin(user) && (
        <div>
          <StandSelect
            value={selectedStand}
            onChange={(value) => setSelectedStand(value)}
          />
        </div>
      )}
      <ul>
        {products.map((product) => (
          <li key={product.uuid}>
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
          </li>
        ))}
      </ul>
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
