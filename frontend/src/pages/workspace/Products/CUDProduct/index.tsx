import { useHandleApiError } from "@/axios/handlerApiError";
import StandSelect from "@/components/StandSelect";
import {
  hasFunction,
  isSeller,
  isUserLogged,
} from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import {
  checkCreateProduct,
  initialProductState,
  productReducer,
} from "@reducer/productReducer";
import { createProduct } from "@service/stand/productService";
import { useEffect, useReducer } from "react";

function CUDProduct() {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();

  useEffect(() => {
    if (isUserLogged(user) && hasFunction(user.summaryFunction)) {
      dispatch({
        type: "SET_STAND_UUID",
        payload: user.summaryFunction.uuid,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      checkCreateProduct(state) &&
      isUserLogged(user) &&
      isSeller(user.summaryFunction)
    ) {
      try {
        const product = await createProduct(state);
        addNotification({
          title: "Create Product Success",
          message: `Create product ${product.productName}${product.description && ", description:"}${product.description}, price: ${product.price}, stock: ${product.stock}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nome do produto</label>
        <input
          value={state.productName}
          onChange={(e) =>
            dispatch({ type: "SET_PRODUCT_NAME", payload: e.target.value })
          }
        />
        <label>Resumo</label>
        <input
          value={state.summary}
          onChange={(e) =>
            dispatch({ type: "SET_SUMMARY", payload: e.target.value })
          }
        />
        <label>Descrição</label>
        <input
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
        />
        <label>Preço</label>
        <input
          type="number"
          value={state.price.toFixed(2)}
          onChange={(e) =>
            dispatch({ type: "SET_PRICE", payload: parseFloat(e.target.value) })
          }
        />
        <label>Estoque</label>
        <input
          type="number"
          value={state.stock.toFixed(2)}
          onChange={(e) =>
            dispatch({ type: "SET_STOCK", payload: parseFloat(e.target.value) })
          }
        />
        <label>Imagem</label>
        <input type="file" />
        {isUserLogged(user) &&
          user.voluntaryRole === VoluntaryRole.ROLE_ADMIN && (
            <StandSelect
              value={state.standUuid}
              onChange={(e) =>
                dispatch({ type: "SET_STAND_UUID", payload: e.target.value })
              }
            />
          )}
      </form>
    </div>
  );
}

export default CUDProduct;
