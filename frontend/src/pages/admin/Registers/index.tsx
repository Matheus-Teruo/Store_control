import styles from "./Registers.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import {
  isAdmin,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryRegister } from "@data/registers/Register";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import { EditSVG, PlusSVG } from "@/assets/svg";
import { SummaryStand } from "@data/stands/Stand";
import useStandService from "@service/stand/useStandService";
import useRegisterService from "@service/registers/useRegisterService";
import FormRegister from "./FormRegister";
import activeConfig from "@/config/activeConfig";

function Registers() {
  const [registers, setRegisters] = useState<SummaryRegister[]>([]);
  const [standsRecord, setStandsRecord] = useState<
    Record<string, Omit<SummaryStand, "uuid">>
  >({});
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getListStands } = useStandService();
  const { getRegisters } = useRegisterService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStands = async () => {
      const stands = await getListStands();
      if (stands) {
        const standsObject = stands.reduce(
          (acc, stand) => {
            const { uuid, ...rest } = stand;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryStand, "uuid">>,
        );
        setStandsRecord(standsObject);
      }
    };
    fetchStands();
  }, [getListStands]);

  const fetchRegisters = useCallback(async () => {
    const response = await getRegisters(
      page.number,
      undefined,
      "functionName,asc",
    );
    if (response) {
      setRegisters(response.content);
      pageDispatch({
        type: "SET_PAGE_MAX",
        payload: response.page.totalPages,
      });
    }
  }, [page.number, getRegisters]);

  useEffect(() => {
    if (isUserLogged(user) && isAdmin(user)) {
      fetchRegisters();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchRegisters]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchRegisters();
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p>Nome do caixa</p>
        <p>Estande associado</p>
        <p className={styles.propAligned}>Editar</p>
      </li>
      <ul className={styles.main}>
        {registers.map((register, index) => (
          <li
            key={register.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{register.registerName}</p>
            <p>
              {standsRecord[register.standUUid]
                ? standsRecord[register.standUUid].standName
                : ""}
            </p>
            <Button
              className={styles.editRegister}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: register.uuid })
              }
            >
              <EditSVG size={16} />
            </Button>
          </li>
        ))}
        <li key={"add"}>
          <Button
            className={styles.newRegister}
            onClick={() => formDispach({ type: "SET_CREATE" })}
            disabled={!activeConfig.enableToken}
          >
            <PlusSVG size={18} />
            <p>Caixa</p>
          </Button>
        </li>
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <FormRegister
          type={formState.type}
          hide={handleFormShow}
          uuid={formState.uuid}
        />
      )}
    </div>
  );
}

export default Registers;
