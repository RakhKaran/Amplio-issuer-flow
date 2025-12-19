import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBondEstimations(filter) {
    let URL = endpoints.bondEstimations.list;

    if (filter) {
        URL = endpoints.bondEstimations.filterList(filter);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            bondEstimations: data?.estimations?.data || [],
            count: data?.estimations?.count || 0,
            bondEstimationsLoading: isLoading,
            bondEstimationsError: error,
            bondEstimationsValidating: isValidating,
            bondEstimationsEmpty: !isLoading && !data?.estimations?.data.length,
        }),
        [data?.estimations, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBondEstimation(applicationId) {
    const URL = applicationId ? endpoints.bondEstimations.details(applicationId) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            bondEstimation: data?.estimation,
            bondEstimationLoading: isLoading,
            bondEstimationError: error,
            bondEstimationValidating: isValidating,
        }),
        [data?.estimation, error, isLoading, isValidating]
    );

    return memoizedValue;
}
