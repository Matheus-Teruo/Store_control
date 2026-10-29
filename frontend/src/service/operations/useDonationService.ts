import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Donation, { SummaryDonation } from "@data/operations/Donation";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useDonationService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getDonation = useCallback(
    async (donationUuid: string): Promise<Donation> =>
      safeRequest(() =>
        api
          .get<Donation>(`donations/${donationUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getDonations = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryDonation>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryDonation>>("donations", {
          params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getDonation,
    getDonations,
  };
};

export default useDonationService;
