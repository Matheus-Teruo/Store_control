import styles from "./TransactionDetail.module.scss";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useEffect, useState } from "react";
import Transaction from "@data/operations/Transaction";
import useTransactionService from "@service/operations/useTransactionService";
import GlassBackground from "@/components/GlassBackground";
import Button from "@/components/utils/Button";
import { CheckSVG, XSVG } from "@/assets/svg";
import { isAdmin } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import ComponentWrapper from "@/components/ComponentWrapper";
import { TransactionTypeMetadata } from "@/components/selects/TransactionTypeSelect/TransactionTypeMetadata";

type TransactionDetailProps = {
  hide: () => void;
  uuid?: string;
};

function TransactionDetail({ hide, uuid }: TransactionDetailProps) {
  const [transaction, setTransaction] = useState<Transaction>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<"delete" | "">("");
  const { addNotification } = useAlertsContext();
  const { user } = useUserContext();
  const { getTransaction, deleteTransaction } = useTransactionService();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (uuid) {
        const transaction = await getTransaction(uuid);
        if (transaction) {
          setTransaction(transaction);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchTransaction();
  }, [uuid, getTransaction]);

  const handleDeleteSubmit = async () => {
    if (uuid && transaction) {
      setWaitingFetch("delete");
      await deleteTransaction(uuid);
      addNotification({
        title: "Delete Transaction Success",
        message: `Delete Transaction: ${uuid}`,
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
            <p>{transaction?.transactionTimestamp.replace("T", " ")}</p>
            <label>Voluntário</label>
            <p>{transaction?.summaryVoluntary.fullname}</p>
            <label>Caixa</label>
            <p>{transaction?.summaryRegister.registerName}</p>
            <label>Tipo de transação</label>
            <p>
              {transaction &&
                TransactionTypeMetadata[transaction?.transactionTypeEnum].pt}
            </p>
            <label>Valor</label>
            <p>R${transaction?.amount.toFixed(2)}</p>
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

export default TransactionDetail;
