import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export function useGetDpn() {
  const URL = endpoints.businessKyc.dpn;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dpn: data?.data ?? [],
      dpnLoading: isLoading,
      dpnError: error,
      dpnValidating: isValidating,
      dpnEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
