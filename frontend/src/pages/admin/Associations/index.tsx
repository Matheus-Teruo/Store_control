import styles from "./Associations.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import Button from "@/components/utils/Button";
import {
  isManeger,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryAssociation } from "@data/stands/Association";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useAssociationService from "@service/stand/useAssociationService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAssociation from "./FormAssociation";
import { EditSVG, PlusSVG } from "@/assets/svg";

function Associations() {
  const [associations, setAssociations] = useState<SummaryAssociation[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getAssociations } = useAssociationService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchAssociations = useCallback(async () => {
    const response = await getAssociations(page.number);
    if (response) {
      setAssociations(response.content);
      pageDispatch({
        type: "SET_PAGE_MAX",
        payload: response.page.totalPages,
      });
    }
  }, [page.number, getAssociations]);

  useEffect(() => {
    if (isUserLogged(user) && isManeger(user)) {
      fetchAssociations();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchAssociations]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchAssociations();
  };

  return (
    <div className={styles.body}>
      <ul className={styles.main}>
        <li key={"header"} className={styles.listHeader}>
          <p>Nome da associação</p>
          <p className={styles.propAligned}>Editar</p>
        </li>
        {associations.map((association, index) => (
          <li
            key={association.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{association.associationName}</p>
            <Button
              className={styles.associationEdit}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: association.uuid })
              }
            >
              <EditSVG size={16} />
            </Button>
          </li>
        ))}
        <li key={"add"}>
          <Button
            className={styles.newAssociation}
            onClick={() => formDispach({ type: "SET_CREATE" })}
          >
            <PlusSVG size={18} />
            <p>Associação</p>
          </Button>
        </li>
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <>
          <FormAssociation
            type={formState.type}
            hide={handleFormShow}
            uuid={formState.uuid}
          />
          <div
            className={styles.popupBackground}
            onClick={() => formDispach({ type: "SET_FALSE" })}
          />
        </>
      )}
    </div>
  );
}

export default Associations;
