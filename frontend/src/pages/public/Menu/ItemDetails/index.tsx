import styles from "./ItemDetails.module.scss";
import ComponentWrapper from "@/components/ComponentWrapper";
import GlassBackground from "@/components/GlassBackground";
import Button from "@/components/utils/Button";
import { isColorDark } from "@/utils/colorTextTag";
import Product from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import { useEffect, useState } from "react";

type ItemDetailsProps = {
  uuid: string;
  hide: () => void;
};

function ItemDetails({ uuid, hide }: ItemDetailsProps) {
  const [product, setProduct] = useState<Product>();
  const { getProduct } = useProductService();

  useEffect(() => {
    const fetchProduct = async () => {
      if (uuid) {
        const product = await getProduct(uuid);
        if (product) {
          setProduct(product);
        }
      }
    };

    fetchProduct();
  }, [uuid, getProduct]);

  return (
    <>
      <ComponentWrapper>
        <div className={styles.main}>
          {product && (
            <>
              <h3>{product.productName}</h3>
              {product.productImg && (
                <div className={styles.imageFrame}>
                  <img
                    src={product.productImg}
                    alt="Item Image"
                    style={{ width: "200px" }}
                  />
                </div>
              )}
              <div className={styles.fields}>
                <label>Nome do produto</label>
                <p className={styles.fieldParagraph}>{product.productName}</p>
                {product.tags.length !== 0 && (
                  <>
                    <label>Tags</label>
                    <ul className={styles.tagList}>
                      {product.tags.map((tag) => (
                        <span
                          key={tag.uuid}
                          className={styles.tagItem}
                          style={{
                            backgroundColor: tag.color,
                            color: isColorDark(tag.color) ? "white" : "black",
                          }}
                        >
                          <p>{tag.tagName}</p>
                        </span>
                      ))}
                    </ul>
                  </>
                )}
                {product.summary && (
                  <>
                    <label>Descrição</label>
                    <p className={styles.fieldParagraph}>{product.summary}</p>
                  </>
                )}
                {product.description && (
                  <>
                    <label>Detalhes do Produto</label>
                    <p className={styles.fieldParagraph}>
                      {product.description}
                    </p>
                  </>
                )}
                <label>Preço</label>
                <div className={styles.fieldPrice}>
                  <p>R${(product.price - product.discount).toFixed(2)}</p>
                  <p>
                    {product.discount !== 0 && (
                      <s>R${product.price.toFixed(2)}</s>
                    )}
                  </p>
                </div>
                {product.stock < 5 && (
                  <>
                    <label>status</label>
                    {product.stock === 0 && (
                      <p className={styles.fieldParagraph}>Esgotado</p>
                    )}
                    {product.stock !== 0 && (
                      <p className={styles.fieldParagraph}>Últimas unidades</p>
                    )}
                  </>
                )}
                <div className={styles.footerButtons}>
                  <Button onClick={() => hide()}>Fechar</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ComponentWrapper>
      <GlassBackground onClick={() => hide()} />
    </>
  );
}

export default ItemDetails;
