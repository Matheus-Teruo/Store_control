import { useHandleApiError } from "@/axios/handlerApiError";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryTransaction } from "@data/operations/Transaction";
import { getTransactions } from "@service/operations/transactionService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState<SummaryTransaction[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const response = await getTransactions();
          setTransactions(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (isAdmin(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

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
