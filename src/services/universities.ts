import { apiInstance } from '@/utilities/apiInstance';
import useSWR from 'swr';

const fetcher = (url: string) => apiInstance({}).get(url).then((res) => res.data);

function useUniversities() {
  const { data, error } = useSWR('/univ', fetcher);

  return {
    universities: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export { useUniversities };