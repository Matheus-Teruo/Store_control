import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Recharge {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimeStamp: string; // TODO: data
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryRecharge {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimeStamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface RechargeOrder {
  uuid: string;
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  rechargeTimeStamp: string; // TODO: data
}

export interface CreateRecharge {
  rechargeValue: number;
  paymentTypeEnum: PaymentType;
  orderCardId: string;
  cashRegisterUuid: string;
}

export enum PaymentType {
  CREDIT = "credit",
  DEBIT = "debit",
  CASH = "cash",
}
