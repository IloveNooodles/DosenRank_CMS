import { apiInstance } from '@/utilities/apiInstance';
import useSWR, { Fetcher } from 'swr';

interface Universities {
  id: number;
  name: string;
  slug: string;
}

interface UniversitiesResponse {
  data: Universities[];
}

const fetcher: Fetcher<UniversitiesResponse, string> = (url) => apiInstance({}).get(url).then((res) => res.data);

function useUniversities() {
  const { data, error } = useSWR('/univ/', fetcher);

  return {
    universities: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}

export { useUniversities };
