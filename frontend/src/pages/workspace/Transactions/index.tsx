import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryTransaction } from "@data/operations/Transaction";
import useTransactionService from "@service/operations/useTransactionService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState<SummaryTransaction[]>([]);
  const { getTransactions } = useTransactionService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        const response = await getTransactions();
        if (response) setTransactions(response.content);
      } else if (isAdmin(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, getTransactions]);

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.uuid}>
          <p>{transaction.amount}</p>
          <p>{transaction.transactionTypeEnum}</p>
          <p>{transaction.transactionTimeStamp}</p>
        </div>
      ))}
    </div>
  );
}

export default Transactions;
