import styles from "./Stands.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import {
  isAdmin,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryStand } from "@data/stands/Stand";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useStandService from "@service/stand/useStandService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormStand from "./FormStand";
import Button from "@/components/utils/Button";
import { EditSVG, PlusSVG } from "@/assets/svg";
import { SummaryAssociation } from "@data/stands/Association";
import useAssociationService from "@service/stand/useAssociationService";

function Stands() {
  const [stands, setStands] = useState<SummaryStand[]>([]);
  const [associationsRecord, setAssociationsRecord] = useState<
    Record<string, Omit<SummaryAssociation, "uuid">>
  >({});
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getListAssociations } = useAssociationService();
  const { getStands } = useStandService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssociations = async () => {
      const products = await getListAssociations();
      if (products) {
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryAssociation, "uuid">>,
        );
        setAssociationsRecord(productsObject);
      }
    };
    fetchAssociations();
  }, [getListAssociations]);

  const fetchStands = useCallback(async () => {
    const response = await getStands(page.number);
    if (response) {
      setStands(response.content);
      pageDispatch({
        type: "SET_PAGE_MAX",
        payload: response.page.totalPages,
      });
    }
  }, [page.number, getStands]);

  useEffect(() => {
    if (isUserLogged(user) && isAdmin(user)) {
      fetchStands();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchStands]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchStands();
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p>Nome do estande</p>
        <p>Associação</p>
        <p className={styles.propAligned}>Editar</p>
      </li>
      <ul className={styles.main}>
        {stands.map((stand, index) => (
          <li
            key={stand.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{stand.standName}</p>
            <p>
              {associationsRecord[stand.associationUuid]
                ? associationsRecord[stand.associationUuid].associationName
                : ""}
            </p>
            <Button
              className={styles.standEdit}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: stand.uuid })
              }
            >
              <EditSVG size={16} />
            </Button>
          </li>
        ))}
        <li key={"add"}>
          <Button
            className={styles.newStand}
            onClick={() => formDispach({ type: "SET_CREATE" })}
          >
            <PlusSVG size={18} />
            <p>Estande</p>
          </Button>
        </li>
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <FormStand
          type={formState.type}
          hide={handleFormShow}
          uuid={formState.uuid}
        />
      )}
    </div>
  );
}

export default Stands;
