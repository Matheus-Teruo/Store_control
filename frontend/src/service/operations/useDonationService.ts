import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Donation, { SummaryDonation } from "@data/operations/Donation";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useDonationService = () => {
  const api = useAxios();
  const handleApiError = useApiError();

  const safeRequest = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handleApiError(error);
        return null;
      }
    },
    [handleApiError],
  );

  const getDonation = useCallback(
    async (donationUuid: string): Promise<Donation | null> =>
      safeRequest(() =>
        api.get<Donation>(`donations/${donationUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getDonations = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryDonation> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryDonation>
          >("donations", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return { getDonation, getDonations };
};

export default useDonationService;
