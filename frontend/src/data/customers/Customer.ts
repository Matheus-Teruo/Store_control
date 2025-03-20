import { RechargeOrder, SummaryRecharge } from "@data/operations/Recharge";
import OrderCard, { SummaryOrderCard } from "./OrderCard";
import { PurchaseOrder, SummaryPurchase } from "@data/operations/Purchase";
import { DonationOrder, SummaryDonation } from "@data/operations/Donation";
import { RefundOrder, SummaryRefund } from "@data/operations/Refund";

export default interface Customer {
  uuid: string;
  orderCard: OrderCard;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
  summaryRecharges: SummaryRecharge[];
  summaryPurchases: SummaryPurchase[];
  summaryDonation: SummaryDonation;
  summaryRefund: SummaryRefund;
}

export interface SummaryCustomer {
  uuid: string;
  summaryOrderCard: SummaryOrderCard;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
}

export interface CustomerOrder {
  uuid: string;
  orderCard: OrderCard;
  recharges: RechargeOrder[];
  purchases: PurchaseOrder[];
  donation: DonationOrder;
  refund: RefundOrder;
}

export interface CustomerFinalization {
  donationValue: string;
  refundValue: number;
  orderCardId: string;
  cashRegisterUuid: string;
}
