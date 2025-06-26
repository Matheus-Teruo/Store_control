import { SummaryCustomer } from "@data/customers/Customer";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

export default interface Donation {
  uuid: string;
  donationValue: number;
  donationTimestamp: string; // TODO: data
  summaryCustomer: SummaryCustomer;
  summaryVoluntary: SummaryVoluntary;
}

export interface SummaryDonation {
  uuid: string;
  donationValue: number;
  donationTimestamp: string; // TODO: data
  voluntaryUuid: string;
}

export interface DonationCard {
  uuid: string;
  donationValue: number;
  donationTimestamp: string; // TODO: data
}
