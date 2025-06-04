import styles from "./ProductCombosSelect.module.scss";
import { useEffect, useState } from "react";
import { InputStatus } from "@/components/utils/InputStatus";
import { PlusSVG, XSVG } from "@/assets/svg";
import Button from "@/components/utils/Button";
import useProductService from "@service/stand/useProductService";
import { SummaryProduct } from "@data/stands/Product";
import { CreateProductCombo } from "@data/stands/ProductCombo";

interface ProductCombosSelectProps {
  value: CreateProductCombo[];
  onChangeAdd: (event: string) => void;
  onChangeRemove: (event: string) => void;
  productUuid: string;
  standUuid: string;
  showStatus?: boolean;
  message?: string;
}

function ProductCombosSelect({
  value,
  onChangeAdd,
  onChangeRemove,
  productUuid,
  standUuid,
  showStatus,
  message,
}: ProductCombosSelectProps) {
  const [listProducts, setListProducts] = useState<SummaryProduct[]>([]);
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);
  const { getListProducts } = useProductService();

  useEffect(() => {
    const fetchProducts = async () => {
      if (standUuid) {
        const products = await getListProducts(standUuid);
        if (products) setListProducts(products);
      }
    };
    fetchProducts();
  }, [standUuid, getListProducts]);

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleAdd = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeAdd(event.target.value);
    setStatus(InputStatus.Untouched);
  };

  const handleValueAdd = (value: string) => {
    onChangeAdd(value);
    setStatus(InputStatus.Untouched);
  };

  const handleDelete = (uuid: string) => {
    onChangeRemove(uuid);
    setStatus(InputStatus.Untouched);
  };

  const availableProducts = listProducts.filter(
    (product) =>
      !value.some(
        (comboProduct) => comboProduct.includedProductUuid === product.uuid,
      ) &&
      product.uuid !== productUuid &&
      !product.combo,
  );

  const selectedProducts = listProducts
    .filter((product) =>
      value.some(
        (comboProduct) => comboProduct.includedProductUuid === product.uuid,
      ),
    )
    .map((product) => {
      const combo = value.find(
        (comboProduct) => comboProduct.includedProductUuid === product.uuid,
      );

      return {
        ...product,
        quantity: combo?.quantity ?? 1,
      };
    });

  return (
    <div
      className={`${styles.base}
          ${
            status === InputStatus.Accepted
              ? styles.unfocOK
              : status === InputStatus.Rejected && styles.unfocNO
          }`}
    >
      {value.length !== 0 && (
        <ul className={styles.selectedProducts}>
          {selectedProducts.map((product) => (
            <li key={product.uuid} className={styles.listProductCombos}>
              <p>{product.productName}</p>
              <Button onClick={() => handleDelete(product.uuid)}>
                <XSVG size={16} />
              </Button>
              <p className={styles.productQuantity}>{product.quantity}</p>
              <Button
                onClick={() => {
                  handleValueAdd(product.uuid);
                }}
              >
                <PlusSVG size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <select className={styles.select} onChange={handleAdd} value="">
        <option value="">-- adicionar produto --</option>
        {availableProducts.map((product) => (
          <option key={product.uuid} value={product.uuid}>
            {product.productName}
          </option>
        ))}
      </select>
      {status !== InputStatus.Untouched && message && (
        <span className={styles.messageError}>{message}</span>
      )}
    </div>
  );
}

export default ProductCombosSelect;
