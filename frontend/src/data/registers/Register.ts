import { SummaryStand } from "@data/stands/Stand";

export default interface Register {
  uuid: string;
  registerName: string;
  summaryStand?: SummaryStand;
  totalCash: number;
  totalCredit: number;
  totalDebit: number;
  totalPix: number;
}

export interface SummaryRegister {
  uuid: string;
  registerName: string;
  standUUid: string;
}

export interface CreateRegister {
  registerName: string;
  standUuid?: string;
}

export interface UpdateRegister {
  uuid: string;
  registerName?: string;
}
