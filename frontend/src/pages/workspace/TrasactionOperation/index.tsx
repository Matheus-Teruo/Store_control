import { useHandleApiError } from "@/axios/handlerApiError";
import {
  isCashier,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryCashRegister } from "@data/registers/CashRegister";
import { getListRegisters } from "@service/registers/cashRegisterService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transaction() {
  const [registers, setRegisters] = useState<SummaryCashRegister[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isCashier(user.summaryFunction, user.voluntaryRole)
      ) {
        try {
          const response = await getListRegisters();
          setRegisters(response);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isCashier(user.summaryFunction, user.voluntaryRole))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  return <div>Transaction</div>;
}

export default Transaction;
