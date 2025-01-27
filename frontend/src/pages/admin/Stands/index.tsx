import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryStand } from "@data/stands/Stand";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { getStands } from "@service/stand/standService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormStand from "./FormStand";
import Button from "@/components/utils/Button";

function Stands() {
  const [stands, setStands] = useState<SummaryStand[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchStands = useCallback(async () => {
    if (isUserLogged(user)) {
      try {
        const response = await getStands();
        setStands(response.content);
      } catch (error) {
        handleApiError(error);
      }
    } else if (isAdmin(user)) {
      navigate("/");
    }
  }, [user, navigate, handleApiError]);

  useEffect(() => {
    fetchStands();
  }, [fetchStands]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchStands();
  };

  return (
    <div>
      <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
        Criar Estande
      </Button>
      <ul>
        {stands.map((stand) => (
          <li key={stand.uuid}>
            {stand.standName}
            <div
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: stand.uuid })
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
          <FormStand
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

export default Stands;
