import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

export function useGetBusinessKyc() {
  const URL = endpoints.businessKyc.data;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const refreshBusinessKyc = () => {
    mutate();
  };

  return {
    businessKyc: data?.data ?? null,
    businessKycLoading: isLoading,
    businessKycError: error,
    businessKycValidating: isValidating,
    refreshBusinessKyc,
  };
}

export function useGetBusinessKycStepData(statusValue) {
  const URL = statusValue ? endpoints.businessKyc.dataByStatus(statusValue) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      stepData: data,
      stepDataLoading: isLoading,
      stepDataError: error,
      stepDataValidating: isValidating,
      refreshStepData: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
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


export function useGetFinancials() {
  const URL = endpoints.businessKyc.financials;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const getCategoryStatus = (items = []) => {
    if (!items.length) return 0;

    if (items.some((item) => item.status === 2)) return 2; 
    if (items.every((item) => item.status === 1)) return 1; 

    return 0; 
  };

  const financialsDetails = [
    {
      label: 'Financial Statements (Last 3 Years)',
      status: getCategoryStatus(data?.data?.financialStatements),
    },
    {
      label: 'Income Tax Returns (Last 3 Years)',
      status: getCategoryStatus(data?.data?.incomeTaxReturns),
    },
    {
      label: 'GSTR-9 (Last 3 Years)',
      status: getCategoryStatus(data?.data?.gstr9),
    },
    {
      label: 'GST-3B (Last 6 Months)',
      status: getCategoryStatus(data?.data?.gst3b),
    },
  ];

  return {
    financialsDetails,
    financialsLoading: isLoading,
    financialsError: error,
    financialsValidating: isValidating,
    refreshfinancials: mutate,
  };
}




