import styles from "./Cards.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import { PlusSVG } from "@/assets/svg";
import {
  isAdmin,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import Card, { CardStatusMetadata } from "@data/customers/Card";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useCardService from "@service/customer/useCardService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "./FormCard";
import Button from "@/components/utils/Button";

function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getCards } = useCardService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchCards = useCallback(async () => {
    const response = await getCards();
    if (response) {
      setCards(response.content);
    }
  }, [getCards]);

  useEffect(() => {
    if (isUserLogged(user) && isAdmin(user)) {
      fetchCards();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchCards]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchCards();
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p>Código do cartão</p>
        <p>Saldo</p>
        <p className={styles.propAligned}>Status</p>
      </li>
      <ul className={styles.main}>
        {cards.map((card, index) => (
          <li
            key={card.cardId}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{card.cardId}</p>
            <p>{card.debit}</p>
            <p className={styles.propAligned}>
              {CardStatusMetadata[card.active ? 1 : 0].pt}
            </p>
          </li>
        ))}
        <li key={"add"}>
          <Button
            className={styles.newCard}
            onClick={() => formDispach({ type: "SET_CREATE" })}
          >
            <PlusSVG size={18} /> Cadastrar Cartão
          </Button>
        </li>
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && <FormCard hide={handleFormShow} />}
    </div>
  );
}

export default Cards;
