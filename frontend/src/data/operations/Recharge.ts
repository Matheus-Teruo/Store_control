import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Recharge {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimestamp: string; // TODO: data
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryRecharge {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimestamp: string; // TODO: data
  registerUuid: string;
}

export interface RechargeCard {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimestamp: string; // TODO: data
}

export interface CreateRecharge {
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  cardId: string;
  registerUuid: string;
}

export enum PaymentType {
  CREDIT = "credit",
  DEBIT = "debit",
  CASH = "cash",
  PIX = "pix",
}
