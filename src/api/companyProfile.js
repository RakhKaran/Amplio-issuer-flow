import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCompanyProfiles() {
  const URL = endpoints.companyProfile.me;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      CompanyProfiles: data?.profile || [],
      CompanyProfilesLoading: isLoading,
      CompanyProfilesError: error,
      CompanyProfilesValidating: isValidating,
      CompanyProfilesEmpty: !isLoading && !data?.profile?.length,
    }),
    [data?.profile, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCompanyBankDetails() {
  const URL = endpoints.companyProfile.bankDetails;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      BankDetails: data?.bankDetails || [],
      BankDetailsLoading: isLoading,
      BankDetailsError: error,
      BankDetailsValidating: isValidating,
      BankDetailsEmpty: !isLoading && !data?.bankDetails?.length,
    }),
    [data?.bankDetails, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCompanyAddressDetails() {
  const URL = endpoints.companyProfile.addressDetails;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      addressDetails: data || [],
      addressDetailsLoading: isLoading,
      addressDetailsError: error,
      addressDetailsValidating: isValidating,
      addressDetailsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

// export function useGetPost(title) {
//   const URL = title ? [endpoints.post.details, { params: { title } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       post: data?.post,
//       postLoading: isLoading,
//       postError: error,
//       postValidating: isValidating,
//     }),
//     [data?.post, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useGetLatestPosts(title) {
//   const URL = title ? [endpoints.post.latest, { params: { title } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       latestPosts: data?.latestPosts || [],
//       latestPostsLoading: isLoading,
//       latestPostsError: error,
//       latestPostsValidating: isValidating,
//       latestPostsEmpty: !isLoading && !data?.latestPosts.length,
//     }),
//     [data?.latestPosts, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useSearchPosts(query) {
//   const URL = query ? [endpoints.post.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: data?.results || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.results.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
