import PaymentSelect from "@/components/selects/PaymentSelect";
import {
  hasFunction,
  isCashier,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import {
  initialRechargeState,
  rechargeReducer,
} from "@reducer/operation/rechargeReducer";
import useRechargeService from "@service/operations/useRechargeService";
import useProductService from "@service/stand/useProductService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "./OrderCard";
import { PaymentType } from "@data/operations/Recharge";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import PageSelect from "@/components/selects/PageSelect";

function Cashier() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [showItemCalculater, setShowItemCalculater] = useState<boolean>(false);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [state, dispatch] = useReducer(rechargeReducer, initialRechargeState);
  const { addNotification } = useAlertsContext();
  const { getProducts } = useProductService();
  const { createRecharge } = useRechargeService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      const response = await getProducts();
      if (response) {
        setProducts(response.content);
      }
    };

    fetchVoluntary();
  }, [getProducts]);

  useEffect(() => {
    if (isUserLogged(user) && hasFunction(user.summaryFunction)) {
      dispatch({
        type: "SET_CASH_REGISTER_UUID",
        payload: user.summaryFunction.uuid,
      });
    } else if (
      isUserUnlogged(user) ||
      (user && !isCashier(user.summaryFunction, user.voluntaryRole))
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isCashier(user.summaryFunction)) {
      const recharge = await createRecharge({
        rechargeValue: state.rechargeValue,
        paymentTypeEnum: state.paymentTypeEnum!,
        orderCardId: state.orderCardId,
        cashRegisterUuid: state.cashRegisterUuid,
      });
      if (recharge) {
        addNotification({
          title: "Create Recharge Success",
          message: `Value ${recharge.rechargeValue} on ${recharge.paymentTypeEnum} to card ${recharge.summaryCustomer.summaryOrderCard.cardId}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
      }
    }
  };

  return (
    <div>
      <div>Cashier</div>
      <div onClick={() => setShowItemCalculater(true)}>Calculadora</div>
      {showItemCalculater && (
        <>
          <div onClick={() => setShowItemCalculater(false)} />
          <ul>
            {products.map((product) => (
              <li key={product.uuid}>{product.productName}</li>
            ))}
          </ul>
          <PageSelect
            value={page.number}
            max={page.max}
            dispatch={pageDispatch}
          />
        </>
      )}
      <form onSubmit={handleSubmit}>
        <OrderCard
          value={state.orderCardId}
          onChange={(e) =>
            dispatch({ type: "SET_CARD_ID", payload: e.target.value })
          }
        />
        <input
          value={state.rechargeValue.toFixed(2)}
          onChange={(e) =>
            dispatch({
              type: "SET_RECHARGE_VALUE",
              payload: parseFloat(e.target.value),
            })
          }
          type="number"
        />
        <PaymentSelect
          payment={state.paymentTypeEnum}
          onChange={(e) =>
            dispatch({
              type: "SET_RECHARGE_TYPE",
              payload: e.target.value as PaymentType,
            })
          }
        />
      </form>
    </div>
  );
}

export default Cashier;
