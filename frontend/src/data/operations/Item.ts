export default interface Item {
  itemId: string;
  productName: string;
  quantity: number;
  delivered: number;
  unitPrice: number;
  discount: number;
}

export interface CreateItem {
  productUuid: string;
  quantity: number;
  delivered: number;
  unitPrice: number;
  discount: number;
}

export interface UpdateItem {
  productUuid: string;
  delivered: number;
}
