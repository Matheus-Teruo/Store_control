import { PaymentType } from "@data/operations/Recharge";

export default interface ResponseRegisterChart {
  registerUuid: string;
  registerName: string;
  rechargeCharts: ResponseRechargeChartNode[];
}

export interface ResponseRechargeChartNode {
  time: string;
  paymentType: PaymentType;
  total: number;
}

export interface ResponsePaymentTypeChart {
  paymentType: PaymentType;
  total: number;
}
