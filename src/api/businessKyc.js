import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

export function useGetBusinessKyc() {
  const URL =  endpoints.businessKyc.data;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const refreshBusinessKyc = () => {
    mutate();
  };

return {
  businessKyc: data || [],
  businessKycLoading: isLoading,
  businessKycError: error,
  businessKycValidating: isValidating,
  refreshBusinessKyc,
};
}



export function useGetBusinessKycStepData(statusValue) {
    const URL = (statusValue) ? endpoints.businessKyc.dataByStatus(statusValue) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            stepData: data,
            stepDataLoading: isLoading,
            stepDataError: error,
            stepDataValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export function useGetGuarantors() {
  const URL = endpoints.businessKyc.guarantors;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      guarantors: data?.data || [], // backend returns { success, data }
      guarantorsLoading: isLoading,
      guarantorsError: error,
      guarantorsValidating: isValidating,
      refreshGuarantors: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

