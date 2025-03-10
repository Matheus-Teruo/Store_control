import styles from "./FormProduct.module.scss";
import StandSelect from "@/components/selects/StandSelect";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isAdmin, isSeller, isUserLogged } from "@/utils/checkAuthentication";
import {
  isMessage,
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
import GlassBackground from "@/components/GlassBackground";

type FormPurchaseProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormProduct({ type, hide, uuid }: FormPurchaseProps) {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const [initial, setInitial] = useState<Product>();
  const [image, setImage] = useState<{ path: string; updated: boolean }>({
    path: "",
    updated: false,
  });
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<
    "create/update" | "delete" | ""
  >("");
  const [touched, setTouched] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
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
          setImage({
            path: product.productImg ? product.productImg : "",
            updated: false,
          });
          setInitial(product);
        }
      } else if (type === "update" && uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchProduct();
  }, [uuid, type, getProduct]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch("create/update");
    setTouched(false);
    const product = await createProduct(createProductPayload(state));
    if (product && !isMessage(product)) {
      addNotification({
        title: "Create Product Success",
        message: `Create product ${product.productName}, price: ${product.price}, stock: ${product.stock}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    } else if (isMessage(product)) {
      const message = product;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setTouched(true);
    setWaitingFetch("");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      setWaitingFetch("create/update");
      setTouched(false);
      const product = await updateProduct(updateProductPayload(state, initial));
      if (product && !isMessage(product)) {
        addNotification({
          title: "Update Product Success",
          message: `Update product ${product.productName}${product.description && ", description:"}${product.description}, price: ${product.price}, stock: ${product.stock}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } else if (isMessage(product)) {
        const message = product;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
    }
    setTouched(true);
    setWaitingFetch("");
  };

  const handleDeleteSubmit = async () => {
    setWaitingFetch("create/update");
    await deleteProduct(state.uuid);
    addNotification({
      title: "Delete Product Success",
      message: `Delete product ${state.productName}`,
      type: MessageType.OK,
    });
    dispatch({ type: "RESET" });
    setConfirmDelete(false);
    hide();
    setWaitingFetch("");
  };

  return (
    <>
      <div className={styles.main}>
        <h3>{type === "create" ? "Criar Produto" : "Editar Produto"}</h3>
        {image.path !== "" && (
          <div
            className={`${styles.imageFrame} ${image.updated && (initial?.productImg !== state.productImg ? styles.imageUpdated : styles.imageUploaded)}`}
          >
            <img src={image.path} alt="Preview" style={{ width: "200px" }} />
          </div>
        )}
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
            showStatus={touched}
            message={messageError["productName"]}
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
            showStatus={touched}
            message={messageError["summary"]}
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
              dispatch({
                type: "SET_PRICE",
                payload: e.target.value,
              })
            }
            showStatus={touched}
            message={messageError["price"]}
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
                    payload: e.target.value,
                  })
                }
                showStatus={touched}
                message={messageError["descount"]}
              />
            </>
          )}
          <label>Estoque</label>
          <Input
            type="number"
            id="productStock"
            isRequired
            value={state.stock.toFixed(0)}
            onChange={(e) =>
              dispatch({ type: "SET_STOCK", payload: parseInt(e.target.value) })
            }
            showStatus={touched}
            message={messageError["stock"]}
          />
          <div className={styles.imageUpload}>
            <label>Upload de Imagem</label>
            <ImageUpload
              onChangeImage={(value) =>
                setImage({
                  path: value,
                  updated: true,
                })
              }
              onChange={(value) =>
                dispatch({ type: "SET_PRODUCT_IMG", payload: value })
              }
            />
          </div>
          {isUserLogged(user) && isAdmin(user) && (
            <div className={styles.adminSection}>
              <p>Modo administrador</p>
              <label>Selecione o estande para o produto</label>
              <StandSelect
                value={state.standUuid}
                onChange={(value) =>
                  dispatch({ type: "SET_STAND_UUID", payload: value })
                }
                notNull
                showStatus={touched}
                message={messageError["standUuid"]}
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
                  loading={waitingFetch === "delete"}
                >
                  <CheckSVG size={16} />
                </Button>
              </div>
            )}
            <div />
            <Button
              type={ButtonHTMLType.Submit}
              loading={waitingFetch === "create/update"}
            >
              {type === "create" ? "Criar" : "Editar"}
            </Button>
          </div>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormProduct;
