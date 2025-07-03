import { SummaryRegister } from "@data/registers/Register";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Transaction {
  uuid: string;
  amount: number;
  transactionTypeEnum: TransactionType;
  transactionTimestamp: string; // TODO: data
  summaryRegister: SummaryRegister;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryTransaction {
  uuid: string;
  amount: number;
  transactionTypeEnum: TransactionType;
  transactionTimestamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface CreateTransaction {
  amount: number;
  transactionTypeEnum: TransactionType;
  registerUuid: string;
}

export enum TransactionType {
  ENTRY = "entry",
  EXIT = "exit",
}
