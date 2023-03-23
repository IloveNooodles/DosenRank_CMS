import { ProfessorsResponse } from '@/interfaces';
import { apiInstance } from '@/utils/apiInstance';
import useSWR, { Fetcher } from 'swr';

const fetcher: Fetcher<ProfessorsResponse, string> = (url) =>
  apiInstance({})
    .get(url)
    .then((res) => res.data);

function useProfessors() {
  const { data, error, isLoading } = useSWR('/professor/', fetcher);

  return {
    professors: data?.data,
    isLoading: isLoading,
    error: error,
  };
}

export { useProfessors };
