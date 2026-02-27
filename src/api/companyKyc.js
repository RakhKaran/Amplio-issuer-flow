import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(sessionId) {
  const URL = sessionId ? endpoints.companyKyc.kycProgress(sessionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  useEffect(() => {
    if (data?.profile?.usersId) {
      sessionStorage.setItem('company_user_id', data.profile.usersId);
    }
    if (data?.profile?.id) {
      sessionStorage.setItem('company_profile_id', data.profile.id);
    }
  }, [data]);

  const memoizedValue = useMemo(
    () => ({
      kycProgress: data || null,
      hasProfile: Boolean(data?.currentProgress?.length),
      profileId: data?.profile?.id || null,
      usersId: data?.profile?.usersId || null,
      kycProgressLoading: isLoading,
      kycProgressError: error,
      kycProgressValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKycSection(section, route = '') {
  const usersId =
    sessionStorage.getItem('company_user_id') || sessionStorage.getItem('company_profile_id');

  const URL = section && usersId ? endpoints.companyKyc.getSection(section, usersId, route) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (section === 'company_documents' && URL) {
      console.log('[KYC company_documents] request id debug:', {
        requestId: usersId,
        company_user_id: sessionStorage.getItem('company_user_id'),
        company_profile_id: sessionStorage.getItem('company_profile_id'),
        url: URL,
      });
    }
  }, [section, URL, usersId]);

  return {
    kycSectionData: data || null,
    kycSectionLoading: isLoading,
    kycSectionError: error,
    kycSectionValidating: isValidating,
    kycSectionEmpty: !isLoading && !data,
    refreshKycSection: () => mutate(),
  };
}
export function useGetDetails() {
  const profileId = sessionStorage.getItem('company_user_id'); // ⬅️ Directly read

  const URL = profileId
    ? endpoints.companyKyc.getSection('company_bank_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDetails = () => {
    mutate();
  };

  return {
    Details: data?.data || null,
    rawData: data || null,
    Loading: isLoading,
    Error: error,
    Validating: isValidating,
    Empty: !isLoading && !data?.data?.length,
    refreshDetails,
  };
}

export function useGetKycAddressDetails() {
  const profileId = sessionStorage.getItem('company_user_id');

  const URL = profileId
    ? endpoints.companyKyc.getSection('company_address_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const rawAddressData = data?.data;
  const addressRows = Array.isArray(rawAddressData) ? rawAddressData : [];

  const registeredAddress =
    addressRows.find((item) => item?.addressType === 'registered') ||
    rawAddressData?.registeredAddress ||
    data?.registeredAddress ||
    null;
  const correspondenceAddress =
    addressRows.find((item) => item?.addressType === 'correspondence') ||
    rawAddressData?.correspondenceAddress ||
    data?.correspondenceAddress ||
    null;

  return {
    registeredAddress,
    correspondenceAddress,
    addressDetailsLoading: isLoading,
    addressDetailsError: error,
    addressDetailsValidating: isValidating,
    refreshAddressDetails: () => mutate(),
  };
}

export function useGetSignatories() {
  const profileId = sessionStorage.getItem('company_user_id');

  const URL = profileId
    ? endpoints.companyKyc.getSection('company_authorized_signatories', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate();
  };

  return {
    signatories: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshSignatories,
  };
}

export function useGetDocuments(companyId) {
  const URL = endpoints.companyKyc.getDocuments;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate();
  };

  return {
    documents: data?.documents || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.documents || data.documents.length === 0),
    refreshDocuments,
  };
}

export function useGetBankDetails() {
  const URL = endpoints.companyKyc.getBankDetails;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const refreshBankDetail = () => {
    mutate();
  };

  return {
    bankDetails: data?.bankDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.bankDetails?.length,
    raw: data,
    refreshBankDetail,
  };
}

export function useGetBankDetail(id) {
  const URL = id ? endpoints.companyKyc.details(id) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    bank: data?.bankDetails || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshBank: () => mutate(),
  };
}


export default function useGetProfileData() {
  const URL = endpoints.companyKyc.getProfileData;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    profileData: data?.profile || null,
    loading: isLoading,
    error,
    validating: isValidating,
  };
}

