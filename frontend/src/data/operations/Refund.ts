import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Refund {
  uuid: string;
  refundValue: number;
  refundTimeStamp: string; // TODO: data
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryRefund {
  uuid: string;
  refundValue: number;
  refundTimeStamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface RefundOrder {
  uuid: string;
  refundValue: number;
  refundTimeStamp: string; // TODO: data
}
