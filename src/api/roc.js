import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export function useGetRoc() {
  const URL = endpoints.businessKyc.roc;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      roc: data?.data ?? [],
      rocLoading: isLoading,
      rocError: error,
      rocValidating: isValidating,
      rocEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
