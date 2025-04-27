import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import Item, { CreateItem } from "./Item";
import { PaymentType } from "./Recharge";

export default interface Trade {
  uuid: string;
  rechargeUuid: string;
  purchaseUuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  onOrder: boolean;
  tradeTimeStamp: string; // TODO: data
  items: Item[];
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryTrade {
  uuid: string;
  rechargeUuid: string;
  purchaseUuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  onOrder: boolean;
  tradeTimeStamp: string; // TODO: data
  totalItems: number;
  voluntaryUuid: string;
}

export interface CreateTrade {
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  orderCardId: string;
  cashRegisterUuid: string;
  onOrder: boolean;
  standUuid: string;
  items: CreateItem[];
}
