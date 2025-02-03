import PageSelect from "@/components/PageSelect";
import Button from "@/components/utils/Button";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryAssociation } from "@data/stands/Association";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useAssociationService from "@service/stand/useAssociationService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAssociation from "./FormAssociation";

function Associations() {
  const [associations, setAssociations] = useState<SummaryAssociation[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getAssociations } = useAssociationService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchAssociations = useCallback(async () => {
    const response = await getAssociations(page.number);
    if (response) setAssociations(response.content);
  }, [page.number, getAssociations]);

  useEffect(() => {
    if (isUserLogged(user)) {
      fetchAssociations();
    } else if (isAdmin(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchAssociations]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchAssociations();
  };

  return (
    <div>
      <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
        Criar Associação
      </Button>
      <ul>
        {associations.map((association) => (
          <li key={association.uuid}>
            <p>{association.associationName}</p>
            <div
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: association.uuid })
              }
            >
              Editar
            </div>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <>
          <FormAssociation
            type={formState.type}
            hide={handleFormShow}
            uuid={formState.uuid}
          />
          <div onClick={() => formDispach({ type: "SET_FALSE" })}>Editar</div>
        </>
      )}
    </div>
  );
}

export default Associations;
