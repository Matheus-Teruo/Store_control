import PageSelect from "@/components/selects/PageSelect";
import styles from "./TransactionLogs.module.scss";
import { isManeger, isUserUnlogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryTransaction } from "@data/operations/Transaction";
import TransactionDetail from "./TransactionDetail";
import useTransactionService from "@service/operations/useTransactionService";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import Button from "@/components/utils/Button";
import { InfoSVG } from "@/assets/svg";
import { TransactionTypeMetadata } from "@/components/selects/TransactionTypeSelect/TransactionTypeMetadata";

function TransactionLogs() {
  const [transactions, setTransactions] = useState<SummaryTransaction[]>([]);
  const [volunteersRecord, setVolunteersRecord] = useState<
    Record<string, Omit<SummaryVoluntary, "uuid">>
  >({});
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getTransactions } = useTransactionService();
  const { getListVolunteers } = useVoluntaryService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      const volunteers = await getListVolunteers();
      if (volunteers) {
        const volunteersObject = volunteers.reduce(
          (acc, voluntary) => {
            const { uuid, ...rest } = voluntary;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryVoluntary, "uuid">>,
        );
        setVolunteersRecord(volunteersObject);
      }
    };
    fetchVolunteers();
  }, [getListVolunteers]);

  const fetchTransactions = useCallback(async () => {
    if (isManeger(user)) {
      const response = await getTransactions(
        page.number,
        undefined,
        "transactionTimestamp,asc",
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
        <p className={styles.headerVoluntary}>Voluntário</p>
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
              {transaction.transactionTimestamp}
            </p>
            <p className={styles.transactionVoluntary}>
              {volunteersRecord[transaction.voluntaryUuid]?.fullname ||
                "Nome não disponível"}
            </p>
            <p className={styles.transactionType}>
              {transaction &&
                TransactionTypeMetadata[transaction?.transactionTypeEnum].pt}
            </p>
            <p className={styles.transactionAmount}>R${transaction.amount}</p>
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
