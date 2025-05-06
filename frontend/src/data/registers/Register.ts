export default interface Register {
  uuid: string;
  readonlyegisterName: string;
  cashTotal: number;
  creditTotal: number;
  debitTotal: number;
}

export interface SummaryRegister {
  uuid: string;
  registerName: string;
}

export interface CreateRegister {
  registerName: string;
}

export interface UpdateRegister {
  uuid: string;
  registerName: string;
}
