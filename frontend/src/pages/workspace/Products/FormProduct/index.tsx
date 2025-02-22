import styles from "./FormProduct.module.scss";
import StandSelect from "@/components/selects/StandSelect";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isAdmin, isSeller, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  createProductPayload,
  initialProductState,
  productReducer,
  updateProductPayload,
} from "@reducer/stand/productReducer";
import useProductService from "@service/stand/useProductService";
import { useEffect, useReducer, useState } from "react";
import ImageUpload from "./ImageUpload";
import Product from "@data/stands/Product";
import Input from "@/components/utils/ProductInput";
import { CheckSVG, XSVG } from "@/assets/svg";

type FormPurchaseProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormProduct({ type, hide, uuid }: FormPurchaseProps) {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const [initial, setInitial] = useState<Product>();
  const [image, setImage] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { getProduct, createProduct, updateProduct, deleteProduct } =
    useProductService();
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
      if (type === "update" && uuid) {
        const product = await getProduct(uuid);
        if (product) {
          dispatch({ type: "SET_PRODUCT", payload: product });
          setInitial(product);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchProduct();
  }, [uuid, type, getProduct]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = await createProduct(createProductPayload(state));
    if (product) {
      addNotification({
        title: "Create Product Success",
        message: `Create product ${product.productName}, price: ${product.price}, stock: ${product.stock}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      const product = await updateProduct(updateProductPayload(state, initial));
      if (product) {
        addNotification({
          title: "Update Product Success",
          message: `Update product ${product.productName}${product.description && ", description:"}${product.description}, price: ${product.price}, stock: ${product.stock}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      }
    }
  };

  const handleDeleteSubmit = async () => {
    await deleteProduct(state.uuid);
    addNotification({
      title: "Delete Product Success",
      message: `Delete product ${state.productName}`,
      type: MessageType.OK,
    });
    dispatch({ type: "RESET" });
    setConfirmDelete(false);
    hide();
  };

  return (
    <div className={styles.main}>
      <h3>{type === "create" ? "Criar Produto" : "Editar Produto"}</h3>
      {image && <img src={image} alt="Preview" style={{ width: "200px" }} />}
      <form
        onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
      >
        <label>Nome do produto</label>
        <Input
          type="text"
          id="productName"
          isRequired
          value={state.productName}
          onChange={(e) =>
            dispatch({ type: "SET_PRODUCT_NAME", payload: e.target.value })
          }
        />
        <label>Resumo</label>
        <Input
          type="text"
          id="productSummary"
          maxLength={255}
          placeholder="Máximo de 255 caracteres"
          value={state.summary}
          onChange={(e) =>
            dispatch({ type: "SET_SUMMARY", payload: e.target.value })
          }
        />
        <label>Descrição</label>
        <textarea
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
          rows={3}
          placeholder="Descreva, contando caracteristicas, história, ou curiosidades do prato"
        />
        <label>Preço</label>
        <Input
          type="number"
          id="productPrice"
          isRequired
          value={state.price.toFixed(2)}
          onChange={(e) =>
            dispatch({ type: "SET_PRICE", payload: parseFloat(e.target.value) })
          }
        />
        {type === "update" && (
          <>
            <label>Desconto</label>
            <Input
              type="number"
              id="productDescount"
              isRequired
              value={state.discount!.toFixed(2)}
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
        <Input
          type="number"
          id="productStock"
          isRequired
          value={state.stock}
          onChange={(e) =>
            dispatch({ type: "SET_STOCK", payload: parseInt(e.target.value) })
          }
        />
        <div className={styles.imageUpload}>
          <label>Upload de Imagem</label>
          <ImageUpload
            onChangeImage={setImage}
            onChange={(value) =>
              dispatch({ type: "SET_PRODUCT_IMG", payload: value })
            }
          />
        </div>
        {isUserLogged(user) && isAdmin(user) && (
          <div className={styles.adminSection}>
            <p>Seleção de administrador</p>
            <label>Escolha</label>
            <StandSelect
              value={state.standUuid}
              onChange={(value) =>
                dispatch({ type: "SET_STAND_UUID", payload: value })
              }
              disabled
            />
          </div>
        )}
        <div className={styles.footerButtons}>
          {type === "update" && !confirmDelete && (
            <Button onClick={() => setConfirmDelete(true)}>Excluir</Button>
          )}
          {confirmDelete && (
            <div className={styles.deleteBody}>
              <span>Excluir?</span>
              <Button
                className={styles.buttonCancelDelete}
                onClick={() => setConfirmDelete(false)}
              >
                <XSVG size={16} />
              </Button>
              <Button
                className={styles.buttonConfirmDelete}
                onClick={handleDeleteSubmit}
              >
                <CheckSVG size={16} />
              </Button>
            </div>
          )}
          <div />
          <Button type={ButtonHTMLType.Submit}>
            {type === "create" ? "Criar" : "Editar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormProduct;
