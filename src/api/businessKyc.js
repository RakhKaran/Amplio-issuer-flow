import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

export function useGetBusinessKyc(businessKycId) {
  const URL = businessKycId ? endpoints.businessKyc.data(businessKycId) : null;

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



export function useGetBusinessKycStepData(businessKycId, statusValue) {
    const URL = (businessKycId && statusValue) ? endpoints.businessKyc.dataByStatus(businessKycId, statusValue) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            stepData: data?.stepData,
            stepDataLoading: isLoading,
            stepDataError: error,
            stepDataValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
