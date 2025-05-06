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

export interface ResponseStandTotalChart {
  standUuid: string;
  standName: string;
  totalProductQuantity: number;
  totalAmount: number;
}

export interface ResponseStandProductTotalChart {
  standUuid: string;
  standName: string;
  productTotalCharts: ResponseProductTotalChart[];
}

export interface ResponseProductTotalChart {
  productUuid: string;
  productName: string;
  totalProductQuantity: number;
  totalAmount: number;
}
