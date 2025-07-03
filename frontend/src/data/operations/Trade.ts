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
  reversal: boolean;
  standUuid: string;
  tradeTimestamp: string; // TODO: data
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
  reversal: boolean;
  standUuid: string;
  tradeTimestamp: string; // TODO: data
  totalItems: number;
}

export interface CreateTrade {
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  cardId: string;
  standUuid: string;
  items: CreateItem[];
}
