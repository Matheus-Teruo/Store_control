import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { getVolunteers } from "@service/voluntary/voluntaryService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormVoluntary from "./FormVoluntary";

function Volunteers() {
  const [volunteers, setVolunteers] = useState<SummaryVoluntary[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchVolunteers = useCallback(async () => {
    if (isUserLogged(user)) {
      try {
        const response = await getVolunteers();
        setVolunteers(response.content);
      } catch (error) {
        handleApiError(error);
      }
    } else if (isAdmin(user)) {
      navigate("/");
    }
  }, [user, navigate, handleApiError]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchVolunteers();
  };

  return (
    <div>
      <ul>
        {volunteers.map((voluntary) => (
          <li key={voluntary.uuid}>
            <p>{voluntary.fullname}</p>
            <p>
              {voluntary.summaryFunction
                ? voluntary.summaryFunction.functionName
                : ""}
            </p>
            <p>{voluntary.voluntaryRole}</p>
            <div
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: voluntary.uuid })
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
          <FormVoluntary hide={handleFormShow} uuid={formState.uuid} />
          <div onClick={() => formDispach({ type: "SET_FALSE" })}>Editar</div>
        </>
      )}
    </div>
  );
}

export default Volunteers;
