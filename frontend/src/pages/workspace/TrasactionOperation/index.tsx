import {
  isRegister,
  isManeger,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryRegister } from "@data/registers/Register";
import useRegisterService from "@service/registers/useRegisterService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transaction() {
  const [registers, setRegisters] = useState<SummaryRegister[]>([]);
  const { getListRegisters } = useRegisterService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isRegister(user.summaryFunction, user.voluntaryRole) &&
        isManeger(user)
      ) {
        const response = await getListRegisters();
        if (response) {
          setRegisters(response);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isRegister(user.summaryFunction, user.voluntaryRole)) ||
        isManeger(user)
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, getListRegisters]);

  return (
    <div>
      <ul>
        {registers.map((register) => (
          <li key={register.uuid}>{register.registerName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Transaction;
