export default interface Card {
  cardId: string;
  debit: number;
  active: boolean;
}

export interface SummaryCard {
  cardId: number;
  debit: number;
}

export interface RequestCard {
  cardId: string;
}
