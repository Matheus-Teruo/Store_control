import { useHandleApiError } from "@/axios/handlerApiError";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import OrderCard from "@data/customers/OrderCard";
import { getCards } from "@service/customer/orderCardService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cards() {
  const [cards, setCards] = useState<OrderCard[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
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
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  return (
    <div>
      {cards.map((card) => (
        <div key={card.cardId}>
          <p>{card.cardId}</p>
          <p>{card.debit}</p>
          <p>{card.active}</p>
        </div>
      ))}
    </div>
  );
}

export default Cards;
