import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocumentTypes() {
    const URL = endpoints.documentType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            documentTypes: data?.data?.documents || [],
            totalCount: data?.data?.count || 0,
            documentTypesLoading: isLoading,
            documentTypesError: error,
            documentTypesValidating: isValidating,
            documentTypesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDocumentType(id) {
    const URL = id ? [endpoints.documentType.details(id)] : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            documentType: data?.data || null,
            documentTypeLoading: isLoading,
            documentTypeError: error,
            documentTypeValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterDocumentTypes(queryString) {
    const URL = queryString ? endpoints.documentType.filterList(queryString) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    return useMemo(
        () => ({
            filteredDocumentTypes: data?.data?.documents || [],
            totalCount: data?.data?.count || 0,
            filterLoading: isLoading,
            filterError: error,
            filterValidating: isValidating,
            filterEmpty: !isLoading && (!data?.data?.documents?.length),
        }),
        [data, error, isLoading, isValidating]
    );
}
