import { useHandleApiError } from "@/axios/handlerApiError";
import StandSelect from "@/components/StandSelect";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isSeller, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import {
  createProductPayload,
  initialProductState,
  productReducer,
  updateProductPayload,
} from "@reducer/productReducer";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "@service/stand/productService";
import { useEffect, useReducer, useState } from "react";

type FormPurchaseProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormProduct({ type, hide, uuid }: FormPurchaseProps) {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();

  useEffect(() => {
    if (isUserLogged(user) && isSeller(user.summaryFunction)) {
      dispatch({
        type: "SET_STAND_UUID",
        payload: user.summaryFunction.uuid,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (
        type === "update" &&
        uuid &&
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        try {
          const product = await getProduct(uuid);
          dispatch({ type: "SET_PRODUCT", payload: product });
        } catch (error) {
          handleApiError(error);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchProduct();
  }, [uuid, type, user, handleApiError]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      isUserLogged(user) &&
      isSeller(user.summaryFunction, user.voluntaryRole)
    ) {
      try {
        const product = await createProduct(createProductPayload(state));
        addNotification({
          title: "Create Product Success",
          message: `Create product ${product.productName}${product.description && ", description:"}${product.description}, price: ${product.price}, stock: ${product.stock}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      uuid &&
      isUserLogged(user) &&
      isSeller(user.summaryFunction, user.voluntaryRole)
    ) {
      try {
        const product = await updateProduct(updateProductPayload(state));
        addNotification({
          title: "Update Product Success",
          message: `Update product ${product.productName}${product.description && ", description:"}${product.description}, price: ${product.price}, stock: ${product.stock}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (
      uuid &&
      isUserLogged(user) &&
      isSeller(user.summaryFunction, user.voluntaryRole)
    ) {
      try {
        await deleteProduct(state.uuid);
        addNotification({
          title: "Delete Product Success",
          message: `Delete product ${state.productName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        setConfirmDelete(false);
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
      >
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
        {type === "update" && state.discount && (
          <>
            <label>Desconto</label>
            <input
              type="number"
              value={state.discount.toFixed(2)}
              onChange={(e) =>
                dispatch({
                  type: "SET_DISCOUNT",
                  payload: parseFloat(e.target.value),
                })
              }
            />
          </>
        )}
        <label>Estoque</label>
        <input
          type="number"
          value={state.stock}
          onChange={(e) =>
            dispatch({ type: "SET_STOCK", payload: parseInt(e.target.value) })
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
        <Button type={ButtonHTMLType.Submit}>
          {type === "create" ? "Criar" : "Editar"}
        </Button>
      </form>
      {type === "update" && !confirmDelete && (
        <Button onClick={() => setConfirmDelete(true)}>Excluir</Button>
      )}
      {confirmDelete && (
        <div>
          <p>Quer deletar esse item?</p>
          <Button onClick={handleDeleteSubmit}>Excluir</Button>
        </div>
      )}
    </div>
  );
}

export default FormProduct;
