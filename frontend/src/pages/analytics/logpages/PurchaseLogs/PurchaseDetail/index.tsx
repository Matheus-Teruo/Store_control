import styles from "./PurchaseDetail.module.scss";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useEffect, useState } from "react";
import Purchase from "@data/operations/Purchase";
import usePurchaseService from "@service/operations/usePurchaseService";
import GlassBackground from "@/components/GlassBackground";
import Button from "@/components/utils/Button";
import { CheckSVG, XSVG } from "@/assets/svg";
import { isAdmin } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import ComponentWrapper from "@/components/ComponentWrapper";

type PurchaseDetailProps = {
  hide: () => void;
  uuid?: string;
};

function PurchaseDetail({ hide, uuid }: PurchaseDetailProps) {
  const [purchase, setPurchase] = useState<Purchase>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<"delete" | "">("");
  const { addNotification } = useAlertsContext();
  const { user } = useUserContext();
  const { getPurchase, deletePurchase } = usePurchaseService();

  useEffect(() => {
    const fetchTrade = async () => {
      if (uuid) {
        const purchase = await getPurchase(uuid);
        if (purchase) {
          setPurchase(purchase);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchTrade();
  }, [uuid, getPurchase]);

  const handleDeleteSubmit = async () => {
    if (uuid && purchase) {
      setWaitingFetch("delete");
      await deletePurchase(uuid);
      addNotification({
        title: "Delete Trade Success",
        message: `Delete trade: ${uuid}`,
        type: MessageType.OK,
      });
      setConfirmDelete(false);
      hide();
    }
    setWaitingFetch("");
  };

  return (
    <>
      <ComponentWrapper>
        <div className={styles.main}>
          <h3>Detalhes de Venda</h3>
          <div className={styles.details}>
            <label>Data</label>
            <p>{purchase?.purchaseTimestamp.replace("T", " ")}</p>
            <label>Voluntário</label>
            <p>{purchase?.summaryVoluntary.fullname}</p>
            <label>Recarga</label>
            <p>
              R$
              {purchase &&
                purchase?.items
                  .reduce(
                    (sum, item) =>
                      sum + item.quantity * (item.unitPrice - item.discount),
                    0,
                  )
                  .toFixed(2)}
            </p>
            <label>Items</label>
            <ul>
              <li key="header" className={styles.listHeader}>
                <p>Nome do Produto</p>
                <p>Quantidade</p>
                <p>Entregue</p>
                <p>Total</p>
              </li>
              {purchase?.items.map((item, index) => (
                <li
                  key={item.productUuid}
                  className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
                >
                  <p>{item.productName}</p>
                  <p>{item.quantity}</p>
                  <p>{item.delivered}</p>
                  <p>
                    R$
                    {((item.unitPrice - item.discount) * item.quantity).toFixed(
                      2,
                    )}
                  </p>
                </li>
              ))}
            </ul>
            <div className={styles.footerButtons}>
              {!confirmDelete ? (
                <>
                  <div />
                  <Button
                    onClick={() => setConfirmDelete(true)}
                    disabled={!isAdmin(user)}
                  >
                    Excluir
                  </Button>
                </>
              ) : (
                <div className={styles.deleteBody}>
                  <Button
                    className={styles.buttonCancelDelete}
                    onClick={() => setConfirmDelete(false)}
                  >
                    <XSVG size={16} />
                  </Button>
                  <span>Excluir?</span>
                  <Button
                    className={styles.buttonConfirmDelete}
                    onClick={handleDeleteSubmit}
                    loading={waitingFetch === "delete"}
                  >
                    <CheckSVG size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ComponentWrapper>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default PurchaseDetail;
