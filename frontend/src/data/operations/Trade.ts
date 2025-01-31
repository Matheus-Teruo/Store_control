import Item, { CreateItem } from "./Item";
import { PaymentType } from "./Recharge";

export default interface Trade {
  rechargeUuid: string;
  purchaseUuid: string;
  rechargeValue: boolean;
  paymentTypeEnum: PaymentType;
  onOrder: boolean;
  tradeTimeStamp: string; // TODO: data
  items: Item[];
}

export interface CreateTrade {
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  orderCardId: string;
  cashRegisterUuid: string;
  onOrder: boolean;
  items: CreateItem[];
}
