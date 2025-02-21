import styles from "./Products.module.scss";
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
import { EditSVG, FilterSVG, ImageSVG } from "@/assets/svg";

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
    <div className={styles.body}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          {isAdmin(user) ? (
            <div className={styles.filter}>
              <FilterSVG size={16} />
              <StandSelect
                value={selectedStand}
                onChange={(value) => setSelectedStand(value)}
              />
            </div>
          ) : (
            <div />
          )}
          <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
            <p>Criar Produto</p>
          </Button>
        </div>
      </div>
      <ul className={styles.main}>
        <li key={"header"} className={styles.listHeader}>
          <p className={styles.productFrame}>Img</p>
          <p className={styles.productName}>Nome do produto</p>
          <p className={styles.productsSummary}>Resumo</p>
          <p className={styles.productDescription}>Descrição</p>
          <p className={styles.productPrice}>Preço</p>
          <p className={styles.productDiscount}>Desconto</p>
          <p className={styles.productStock}>Estoque</p>
          <p className={styles.editProduct}>Editar</p>
        </li>
        {products.map((product) => (
          <li
            key={product.uuid}
            className={`${product.stock === 0 && styles.itemNull}`}
          >
            {product.productImg ? (
              <img className={styles.productImage} src={product.productImg} />
            ) : (
              <div className={styles.productFrame}>
                <ImageSVG
                  size={16}
                  className={`${styles.productImage} ${styles.propNull}`}
                />
              </div>
            )}
            <p className={styles.productName}>{product.productName}</p>
            <p
              className={`${styles.productsSummary} ${product.summary === null && styles.propNull}`}
            >
              Res
            </p>
            <p
              className={`${styles.productDescription} ${product.description && styles.propNull}`}
            >
              Des
            </p>
            <p className={styles.productPrice}>R${product.price.toFixed(2)}</p>
            <p
              className={`${styles.productDiscount} ${product.discount === 0 && styles.propNull}`}
            >
              R${product.discount.toFixed(2)}
            </p>
            <p
              className={`${styles.productStock} ${product.stock === 0 && styles.propNull}`}
            >
              {product.stock}
            </p>
            <div className={styles.productFrame}>
              <Button
                className={styles.editProduct}
                onClick={() =>
                  formDispach({ type: "SET_UPDATE", payload: product.uuid })
                }
              >
                <EditSVG size={16} />
              </Button>
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
          <div
            className={styles.popupBackground}
            onClick={() => formDispach({ type: "SET_FALSE" })}
          />
        </>
      )}
    </div>
  );
}

export default Products;
