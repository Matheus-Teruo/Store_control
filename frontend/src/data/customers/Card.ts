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

export const CardStatusMetadata: Record<number, { pt: string; en: string }> = {
  1: { pt: "Ativo", en: "Active" },
  0: { pt: "Desativado", en: "Deactivated" },
};
