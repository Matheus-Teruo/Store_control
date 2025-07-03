import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import Item, { CreateItem, UpdateItem } from "./Item";

export default interface Purchase {
  uuid: string;
  onOrder: boolean;
  reversal: boolean;
  standUuid: string;
  purchaseTimestamp: string; // TODO: data
  items: Item[];
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryPurchase {
  uuid: string;
  onOrder: boolean;
  reversal: boolean;
  purchaseTimestamp: string; // TODO: data
  standUuid: string;
  totalItems: number;
  totalPurchaseCost: number;
  totalPurchaseDiscount: number;
  finalTotalPurchase: number;
}

export interface PurchaseCard {
  uuid: string;
  onOrder: boolean;
  reversal: boolean;
  standUuid: string;
  purchaseTimestamp: string; // TODO: data
  items: Item[];
}

export interface CreatePurchase {
  standUuid: string;
  items: CreateItem[];
  cardId: string;
}

export interface UpdatePurchase {
  uuid: string;
  items: UpdateItem[];
}
