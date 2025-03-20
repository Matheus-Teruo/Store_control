import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Transaction {
  uuid: string;
  amount: number;
  transactionTypeEnum: TransactionType;
  transactionTimeStamp: string; // TODO: data
  summaryCashRegister: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryTransaction {
  uuid: string;
  amount: number;
  transactionTypeEnum: TransactionType;
  transactionTimeStamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface CreateTransaction {
  amount: number;
  transactionTypeEnum: TransactionType;
  cashRegisterUuid: string;
}

export enum TransactionType {
  ENTRY = "entry",
  EXIT = "exit",
}
