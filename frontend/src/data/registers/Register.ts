export default interface Register {
  uuid: string;
  registerName: string;
  cashTotal: number;
  creditTotal: number;
  debitTotal: number;
  pixTotal: number;
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
