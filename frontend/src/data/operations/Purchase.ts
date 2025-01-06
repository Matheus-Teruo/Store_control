import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import Item, { CreateItem, UpdateItem } from "./Item";

export default interface Purchase {
  uuid: string;
  onOrder: boolean;
  purchaseTimeStamp: string; // TODO: data
  items: Item[];
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryPurchase {
  uuid: string;
  onOrder: boolean;
  purchaseTimeStamp: string; // TODO: data
  totalItems: number;
  totalPurchaseCost: number;
  totalPurchaseDiscount: number;
  finalTotalPurchase: number;
  voluntaryUuid: string;
}

export interface CreatePurchase {
  onOrder: boolean;
  items: CreateItem[];
  orderCardId: string;
}

export interface UpdatePurchase {
  uuid: string;
  onOrder?: boolean;
  items?: UpdateItem[];
}
