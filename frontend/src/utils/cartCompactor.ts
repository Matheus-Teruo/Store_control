import { CreateItem } from "@data/operations/Item";
import { SummaryProduct } from "@data/stands/Product";

interface CompactCreateItem {
  p: string;
  q: number;
  d: number;
  u: number;
  x: number;
}

const paymentMap: Record<string, string> = {
  cash: "ca",
  debit: "d",
  credit: "cr",
};

const reversePaymentMap: Record<string, string> = {
  ca: "cash",
  d: "debit",
  cr: "credit",
};

export function cartPacking(
  input: string,
  products: Record<string, Omit<SummaryProduct, "uuid">>,
): string {
  const data = JSON.parse(input);

  const compacto = {
    o: data.onOrder,
    s: data.standUuid,
    i: data.items.map((item: CreateItem) => ({
      p: products[item.productUuid].productName,
      q: item.quantity,
    })),
    c: data.orderCardId,
    r: data.rechargeValue,
    t: paymentMap[data.paymentTypeEnum],
    qt: data.totalQuantity,
    e: data.error,
  };

  return JSON.stringify(compacto);
}

export function cartUnpacking(
  input: string,
  products: Record<string, Omit<SummaryProduct, "uuid">>,
): string {
  const obj = JSON.parse(input);

  const reconstruido = {
    onOrder: obj.o,
    standUuid: obj.s,
    items: obj.i.map((i: CompactCreateItem) => {
      const produto = Object.entries(products).find(
        ([_uuid, product]) => product.productName === i.p,
      );
      return {
        productUuid: produto?.[0] ?? "desconhecido",
        quantity: i.q,
        delivered: 0,
        unitPrice: produto?.[1].price,
        discount: produto?.[1].discount,
      };
    }),
    orderCardId: obj.c,
    rechargeValue: obj.r,
    paymentTypeEnum: reversePaymentMap[obj.t],
    cashRegisterUuid: undefined,
    totalQuantity: obj.qt,
    error: obj.e,
  };

  return JSON.stringify(reconstruido);
}

export function takeStandUuid(input: string): string {
  const obj = JSON.parse(input);
  return JSON.parse(JSON.stringify(obj.s));
}
