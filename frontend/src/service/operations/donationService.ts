import api from "@/axios/axios";
import Donation, { SummaryDonation } from "@data/operations/Donation";

export const getDonation = async (donationUuid: string): Promise<Donation> => {
  const response = await api.get<Donation>(`donations/${donationUuid}`);
  return response.data;
};

export const getDonations = async (): Promise<SummaryDonation[]> => {
  const response = await api.get<SummaryDonation[]>("donations");
  return response.data;
};
