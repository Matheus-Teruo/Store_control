import api from "@/axios/axios";
import Donation, { SummaryDonation } from "@data/operations/Donation";
import { PaginatedResponse } from "@service/PagesType";

export const getDonation = async (donationUuid: string): Promise<Donation> => {
  const response = await api.get<Donation>(`donations/${donationUuid}`);
  return response.data;
};

export const getDonations = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<PaginatedResponse<SummaryDonation>> => {
  const response = await api.get<PaginatedResponse<SummaryDonation>>(
    "donations",
    {
      params: {
        page: page,
        size: size,
        sort: sort,
      },
    },
  );
  return response.data;
};
