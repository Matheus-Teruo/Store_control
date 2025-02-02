import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { cardReducer, initialCardState } from "@reducer/customer/cardReducer";
import useCardService from "@service/customer/useOrderCardService";
import { useReducer } from "react";

function FormCard({ hide }: { hide: () => void }) {
  const [state, dispatch] = useReducer(cardReducer, initialCardState);
  const { addNotification } = useAlertsContext();
  const { createCard } = useCardService();
  const { user } = useUserContext();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isAdmin(user)) {
      const card = await createCard(state);
      if (card) {
        addNotification({
          title: "Create Card Success",
          message: `Create OrderCard: ${card.cardId}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateSubmit}>
        <label>Card ID</label>
        <input
          value={state.cardId}
          onChange={(e) =>
            dispatch({ type: "SET_CARD", payload: e.target.value })
          }
        />
        <Button type={ButtonHTMLType.Submit}>Criar</Button>
      </form>
    </div>
  );
}

export default FormCard;
