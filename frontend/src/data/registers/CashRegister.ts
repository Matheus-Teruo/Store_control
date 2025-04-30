export default interface CashRegister {
  uuid: string;
  cashRegisterName: string;
  cashTotal: number;
  creditTotal: number;
  debitTotal: number;
}

export interface SummaryCashRegister {
  uuid: string;
  cashRegisterName: string;
}

export interface CreateCashRegister {
  cashRegisterName: string;
}

export interface UpdateCashRegister {
  uuid: string;
  cashRegisterName: string;
}
