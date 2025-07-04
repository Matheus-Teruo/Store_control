import PageSelect from "@/components/selects/PageSelect";
import styles from "./TransactionLogs.module.scss";
import { isManeger, isUserUnlogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryTransaction } from "@data/operations/Transaction";
import TransactionDetail from "./TransactionDetail";
import useTransactionService from "@service/operations/useTransactionService";
import useRegisterService from "@service/registers/useRegisterService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { SummaryRegister } from "@data/registers/Register";
import Button from "@/components/utils/Button";
import { InfoSVG } from "@/assets/svg";
import { TransactionTypeMetadata } from "@/components/selects/TransactionTypeSelect/TransactionTypeMetadata";

function TransactionLogs() {
  const [transactions, setTransactions] = useState<SummaryTransaction[]>([]);
  const [registersRecord, setRegistersRecord] = useState<
    Record<string, Omit<SummaryRegister, "uuid">>
  >({});
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getTransactions } = useTransactionService();
  const { getListRegisters } = useRegisterService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisters = async () => {
      const registers = await getListRegisters();
      if (registers) {
        const registersObject = registers.reduce(
          (acc, register) => {
            const { uuid, ...rest } = register;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryRegister, "uuid">>,
        );
        setRegistersRecord(registersObject);
      }
    };
    fetchRegisters();
  }, [getListRegisters]);

  const fetchTransactions = useCallback(async () => {
    if (isManeger(user)) {
      const response = await getTransactions(
        page.number,
        undefined,
        "transactionTimestamp,desc",
      );
      if (response) {
        setTransactions(response.content);
        pageDispatch({
          type: "SET_PAGE_MAX",
          payload: response.page.totalPages,
        });
      }
    }
  }, [user, page.number, getTransactions]);

  useEffect(() => {
    if (isManeger(user)) {
      fetchTransactions();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchTransactions]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchTransactions();
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p className={styles.headerDate}>Data</p>
        <p className={styles.headerRegister}>Caixa</p>
        <p className={styles.headerType}>Transação</p>
        <p className={styles.headerAmount}>Valor</p>
        <p className={styles.headerDetails}></p>
      </li>
      <ul className={styles.main}>
        {transactions.map((transaction, index) => (
          <li
            key={transaction.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p className={styles.transactionDate}>
              {new Date(
                transaction.transactionTimestamp + "Z",
              ).toLocaleString()}
            </p>
            <p className={styles.transactionRegister}>
              {registersRecord[transaction.registerUuid]?.registerName ||
                "Nome não disponível"}
            </p>
            <p className={styles.transactionType}>
              {transaction &&
                TransactionTypeMetadata[transaction?.transactionTypeEnum].pt}
            </p>
            <p className={styles.transactionAmount}>
              R${transaction.amount.toFixed(2)}
            </p>
            <Button
              className={styles.detailsButton}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: transaction.uuid })
              }
            >
              <InfoSVG />
            </Button>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <TransactionDetail hide={handleFormShow} uuid={formState.uuid} />
      )}
    </div>
  );
}

export default TransactionLogs;
