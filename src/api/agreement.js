import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export function useGetAgreements() {
  const URL = endpoints.businessKyc.agreements;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      agreements: data?.data ?? [],
      agreementsLoading: isLoading,
      agreementsError: error,
      agreementsValidating: isValidating,
      agreementsEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
