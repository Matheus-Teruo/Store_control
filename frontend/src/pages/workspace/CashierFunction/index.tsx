import { useHandleApiError } from "@/axios/handlerApiError";
import {
  hasFunction,
  isCashier,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { PaymentType } from "@data/operations/Recharge";
import { SummaryProduct } from "@data/stands/Product";
import { createRecharge } from "@service/operations/rechargeService";
import { getProducts } from "@service/stand/productService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cashier() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [rechargeValue, setRechargeValue] = useState<number>(0);
  const [rechargeType, setRechagerType] = useState<PaymentType | undefined>(
    undefined,
  );
  const [cardID, setCardID] = useState<string>("");
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user) && isCashier(user.summaryFunction)) {
        try {
          const products = await getProducts();
          setProducts(products);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isCashier(user.summaryFunction))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      rechargeValue > 0 &&
      rechargeType !== undefined &&
      cardID.length === 15 &&
      isUserLogged(user) &&
      hasFunction(user.summaryFunction)
    ) {
      try {
        const recharge = await createRecharge({
          rechargeValue: rechargeValue,
          paymentTypeEnum: rechargeType,
          orderCardId: cardID,
          cashRegisterUuid: user.summaryFunction.uuid,
        });
        addNotification({
          title: "Create Recharge Success",
          message: `Value ${recharge.rechargeValue} on ${recharge.paymentTypeEnum} to card ${recharge.summaryCustomer.summaryOrderCard.cardId}`,
          type: MessageType.OK,
        });
        setRechargeValue(0);
        setRechagerType(undefined);
        setCardID("");
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  return (
    <div>
      <div>Cashier</div>
      {products.map((product) => (
        <div key={product.uuid}>{product.productName}</div>
      ))}
    </div>
  );
}

export default Cashier;
