import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Donation {
  uuid: string;
  donationValue: number;
  donationTimeStamp: string; // TODO: data
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryDonation {
  uuid: string;
  donationValue: number;
  donationTimeStamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface DonationOrder {
  uuid: string;
  donationValue: number;
  donationTimeStamp: string; // TODO: data
}
