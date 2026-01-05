import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { idsector } from 'lodash';

// ----------------------------------------------------------------------

export function useGetSectorTypes() {
    const URL = endpoints.sectorType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            SectorTypes: data || [],
            SectorTypesLoading: isLoading,
            SectorTypesError: error,
            SectorTypesValidating: isValidating,
            SectorTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetSectorType(id) {
    const URL = id ? endpoints.sectorType.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            sectorType: data,
            sectorTypeLoading: isLoading,
            sectorTypeError: error,
            sectorTypeValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterSectorTypes(queryString) {
    const URL = queryString ? endpoints.sectorType.filterList(queryString) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            filteredSectorTypes: data || [],
            filterLoading: isLoading,
            filterError: error,
            filterValidating: isValidating,
            filterEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export function useGetCompanySectorTypes() {
    const URL = endpoints.companySectorType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            SectorTypes: data || [],
            SectorTypesLoading: isLoading,
            SectorTypesError: error,
            SectorTypesValidating: isValidating,
            SectorTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}