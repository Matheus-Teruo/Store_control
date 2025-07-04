import styles from "./FormCard.module.scss";
import GlassBackground from "@/components/GlassBackground";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/CardInput";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { cardReducer, initialCardState } from "@reducer/customer/cardReducer";
import useCardService from "@service/customer/useCardService";
import { useReducer, useState } from "react";

function FormCard({ hide }: { hide: () => void }) {
  const [state, dispatch] = useReducer(cardReducer, initialCardState);
  const [waitingFetch, setWaitingFetch] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { createCard } = useCardService();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch(true);
    setTouched(false);
    const card = await createCard(state);
    if (card && !isMessage(card)) {
      addNotification({
        title: "Create Card Success",
        message: `Create Card: ${card.cardId}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    } else if (isMessage(card)) {
      const message = card;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setTouched(true);
    setWaitingFetch(false);
  };

  return (
    <>
      <div className={styles.main}>
        <h3>Criar Cartão</h3>
        <form onSubmit={handleCreateSubmit}>
          <label>Card ID</label>
          <Input
            value={state.cardId}
            onChange={(e) =>
              dispatch({ type: "SET_CARD", payload: e.target.value })
            }
            showStatus={touched}
            message={messageError["cardId"]}
          />
          <div className={styles.footerButtons}>
            <div />
            <Button type={ButtonHTMLType.Submit} loading={waitingFetch}>
              Criar
            </Button>
          </div>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormCard;
