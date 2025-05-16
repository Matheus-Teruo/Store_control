export default interface ResponseStandChart {
  standUuid: string;
  standName: string;
  productCharts: ResponseProductChart[];
}

export interface ResponseProductChart {
  productUuid: string;
  productName: string;
  purchaseChartNodes: ResponsePurchaseChartNode[];
}

export interface ResponsePurchaseChartNode {
  time: string;
  quantity: number;
  total: number;
}

export interface ResponseStandTotal {
  standUuid: string;
  standName: string;
  totalProductQuantity: number;
  totalAmount: number;
}

export interface ResponseStandProductTotal {
  standUuid: string;
  standName: string;
  productTotal: ResponseProductTotal[];
}

export interface ResponseProductTotal {
  productUuid: string;
  productName: string;
  totalProductQuantity: number;
  totalAmount: number;
}
