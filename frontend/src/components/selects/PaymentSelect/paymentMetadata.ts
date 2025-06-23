import { PaymentType } from "@data/operations/Recharge";

export const PaymentMetadata: Record<PaymentType, { pt: string; en: string }> =
  {
    [PaymentType.CASH]: { pt: "Dinheiro", en: "Cash" },
    [PaymentType.DEBIT]: { pt: "Débito", en: "Debit" },
    [PaymentType.CREDIT]: { pt: "Crédito", en: "Credit" },
    [PaymentType.PIX]: { pt: "Pix", en: "Pix" },
  };

export const PaymentStringMetadata: Record<string, { pt: string; en: string }> =
  {
    CASH: { pt: "Dinheiro", en: "Cash" },
    DEBIT: { pt: "Débito", en: "Debit" },
    CREDIT: { pt: "Crédito", en: "Credit" },
    PIX: { pt: "Pix", en: "Pix" },
  };
