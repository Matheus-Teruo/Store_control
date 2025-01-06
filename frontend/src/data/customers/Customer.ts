import OrderCard, { SummaryOrderCard } from "./OrderCard";

export default interface Customer {
  uuid: string;
  orderCard: OrderCard;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
  summaryRecharges: number; //TODO! adjuste
  summaryPurchases: number; //TODO! adjuste
  summaryDonation: number; //TODO! adjuste
  summaryRefund: number; //TODO! adjuste
}

export interface SummaryCustomer {
  uuid: string;
  summaryOrderCard: SummaryOrderCard;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
}

export interface CustomerFinalization {
  donationValue: string;
  refundValue: number;
  orderCardId: string;
  cashRegisterUuid: string;
}
