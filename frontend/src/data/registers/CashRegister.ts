export default interface CashRegister {
  uuid: string;
  cashRegister: string;
  cashTotal: number;
  creditTotal: number;
  debitTotal: number;
}

export interface SummaryCashRegister {
  uuid: string;
  cashRegister: string;
}

export interface CreateCashRegister {
  cashRegisterName: string;
}

export interface UpdateCashRegister {
  uuid: string;
  cashRegisterName: string;
}
