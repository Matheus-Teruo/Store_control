import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import OrderCard from "@data/customers/OrderCard";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { getCards } from "@service/customer/orderCardService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "./FormCard";
import Button from "@/components/utils/Button";

function Cards() {
  const [cards, setCards] = useState<OrderCard[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchCards = useCallback(async () => {
    if (isUserLogged(user)) {
      try {
        const response = await getCards();
        setCards(response.content);
      } catch (error) {
        handleApiError(error);
      }
    } else if (isAdmin(user)) {
      navigate("/");
    }
  }, [user, navigate, handleApiError]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchCards();
  };

  return (
    <div>
      <Button onClick={() => formDispach({ type: "SET_CREATE" })}>
        Criar Cartão
      </Button>
      <ul>
        {cards.map((card) => (
          <li key={card.cardId}>
            <p>{card.cardId}</p>
            <p>{card.debit}</p>
            <p>{card.active}</p>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <>
          <FormCard hide={handleFormShow} />
          <div onClick={() => formDispach({ type: "SET_FALSE" })}>Editar</div>
        </>
      )}
    </div>
  );
}

export default Cards;
