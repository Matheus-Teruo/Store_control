export default interface OrderCard {
  cardId: string;
  debit: number;
  active: boolean;
}

export interface SummaryOrderCard {
  cardId: number;
  debit: number;
}

export interface RequestOrderCard {
  cardId: string;
}
