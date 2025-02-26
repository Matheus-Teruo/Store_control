import styles from "./Volunteers.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import {
  isAdmin,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryVoluntary, VoluntaryRole } from "@data/volunteers/Voluntary";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import FormVoluntary from "./FormVoluntary";
import { AwardSVG, CircleSVG, EditSVG, ToolSVG } from "@/assets/svg";
import Button from "@/components/utils/Button";

const VoluntaryRoleMetadata: Record<
  VoluntaryRole,
  { label: string; icon: ReactElement }
> = {
  [VoluntaryRole.VOLUNTARY]: {
    label: "Voluntario",
    icon: <CircleSVG size={18} />,
  },
  [VoluntaryRole.MANAGEMENT]: {
    label: "Gerente",
    icon: <AwardSVG size={18} />,
  },
  [VoluntaryRole.ADMIN]: {
    label: "Administrador",
    icon: <ToolSVG size={18} />,
  },
};

function Volunteers() {
  const [volunteers, setVolunteers] = useState<SummaryVoluntary[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getVolunteers } = useVoluntaryService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchVolunteers = useCallback(async () => {
    const response = await getVolunteers();
    if (response) {
      setVolunteers(response.content);
      pageDispatch({
        type: "SET_PAGE_MAX",
        payload: response.page.totalPages,
      });
    }
  }, [getVolunteers]);

  useEffect(() => {
    if (isUserLogged(user) && isAdmin(user)) {
      fetchVolunteers();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchVolunteers]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchVolunteers();
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p>Nome completo</p>
        <p>Função</p>
        <p className={styles.propAligned}>Permissão</p>
        <p className={styles.propAligned}>Editar</p>
      </li>
      <ul className={styles.main}>
        {volunteers.map((voluntary, index) => (
          <li
            key={voluntary.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{voluntary.fullname}</p>
            <p
              className={`${!voluntary.summaryFunction && styles.nullFunction}`}
            >
              {voluntary.summaryFunction
                ? voluntary.summaryFunction.functionName
                : "não definida"}
            </p>
            <p
              className={styles.propAligned}
              title={`${VoluntaryRoleMetadata[voluntary.voluntaryRole].label}`}
            >
              {VoluntaryRoleMetadata[voluntary.voluntaryRole].icon}
            </p>
            <Button
              className={styles.voluntaryEdit}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: voluntary.uuid })
              }
            >
              <EditSVG size={16} />
            </Button>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <FormVoluntary hide={handleFormShow} uuid={formState.uuid} />
      )}
    </div>
  );
}

export default Volunteers;
