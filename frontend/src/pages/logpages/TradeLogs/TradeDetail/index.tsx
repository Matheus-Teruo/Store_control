import styles from "./TradeDetail.module.scss";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useEffect, useState } from "react";
import Trade from "@data/operations/Trade";
import useTradeService from "@service/operations/useTradeService";
import activeConfig, { fixedCardID } from "@/config/activeConfig";
import GlassBackground from "@/components/GlassBackground";
import Button from "@/components/utils/Button";
import { CheckSVG, XSVG } from "@/assets/svg";
import { PaymentStringMetadata } from "@/components/selects/PaymentSelect/paymentMetadata";
import { isAdmin } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";

type TradeDetailProps = {
  hide: () => void;
  uuid?: string;
};

function TradeDetail({ hide, uuid }: TradeDetailProps) {
  const [trade, setTrade] = useState<Trade>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<"delete" | "">("");
  const { addNotification } = useAlertsContext();
  const { user } = useUserContext();
  const { getTrade, deleteTrade } = useTradeService();

  useEffect(() => {
    const fetchTrade = async () => {
      if (uuid) {
        const trade = await getTrade(uuid);
        if (trade) {
          setTrade(trade);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchTrade();
  }, [uuid, getTrade]);

  const handleDeleteSubmit = async () => {
    if (uuid && trade) {
      setWaitingFetch("delete");
      await deleteTrade(
        activeConfig.enableCard ? undefined : fixedCardID, // TODO: add a input to a car later
        uuid,
      );
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
      <div className={styles.main}>
        <h3>Detalhes de Venda</h3>
        <div className={styles.details}>
          <label>Data</label>
          <p>{trade?.tradeTimeStamp.replace("T", " ")}</p>
          <label>Voluntário</label>
          <p>{trade?.summaryVoluntary.fullname}</p>
          <label>Recarga</label>
          <p>R${trade && trade?.rechargeValue.toFixed(2)}</p>
          <label>Tipo de pagamento</label>
          <p>{trade && PaymentStringMetadata[trade?.paymentTypeEnum].pt}</p>
          <label>Items</label>
          <ul>
            <li key="header" className={styles.listHeader}>
              <p>Nome do Produto</p>
              <p>Quantidade</p>
              <p>Entregue</p>
              <p>Total</p>
            </li>
            {trade?.items.map((item, index) => (
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
      <GlassBackground onClick={hide} />
    </>
  );
}

export default TradeDetail;
