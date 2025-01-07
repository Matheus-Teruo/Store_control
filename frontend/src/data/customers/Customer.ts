import { SummaryRecharge } from "@data/operations/Recharge";
import OrderCard, { SummaryOrderCard } from "./OrderCard";
import { SummaryPurchase } from "@data/operations/Purchase";
import { SummaryDonation } from "@data/operations/Donation";
import { SummaryRefund } from "@data/operations/Refund";

export default interface Customer {
  uuid: string;
  orderCard: OrderCard;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
  summaryRecharges: SummaryRecharge;
  summaryPurchases: SummaryPurchase;
  summaryDonation: SummaryDonation;
  summaryRefund: SummaryRefund;
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
