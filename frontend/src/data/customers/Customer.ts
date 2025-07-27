import { RechargeCard, SummaryRecharge } from "@data/operations/Recharge";
import { PurchaseCard, SummaryPurchase } from "@data/operations/Purchase";
import { DonationCard, SummaryDonation } from "@data/operations/Donation";
import { RefundCard, SummaryRefund } from "@data/operations/Refund";

export default interface Customer {
  uuid: string;
  cardDebit: number;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
  summaryRecharges: SummaryRecharge[];
  summaryPurchases: SummaryPurchase[];
  summaryDonation: SummaryDonation;
  summaryRefund: SummaryRefund;
}

export interface SummaryCustomer {
  uuid: string;
  cardDebit: number;
  customerStart: string; // TODO: data
  customerEnd: string; // TODO: data
}

export interface CustomerCard {
  uuid: string;
  cardDebit: number;
  recharges: RechargeCard[];
  purchases: PurchaseCard[];
  donation: DonationCard;
  refund: RefundCard;
}

export interface CustomerFinalization {
  donationValue: string;
  refundValue: number;
  cardId: string;
  registerUuid: string;
}
