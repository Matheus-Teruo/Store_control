import {
  isCashier,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryCashRegister } from "@data/registers/CashRegister";
import useCashRegisterService from "@service/registers/useCashRegisterService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transaction() {
  const [registers, setRegisters] = useState<SummaryCashRegister[]>([]);
  const { getListRegisters } = useCashRegisterService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isCashier(user.summaryFunction, user.voluntaryRole)
      ) {
        const response = await getListRegisters();
        if (response) {
          setRegisters(response);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isCashier(user.summaryFunction, user.voluntaryRole))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, getListRegisters]);

  return <div>Transaction</div>;
}

export default Transaction;
