import { Course, Response } from '@/interfaces';
import { apiInstance } from '@/utils/apiInstance';
import useSWR, { Fetcher } from 'swr';

const fetcher: Fetcher<Response<Course[]>, string> = (url) =>
  apiInstance({})
    .get(url)
    .then((res) => res.data);

function useCourses() {
  const { data, error, isLoading } = useSWR('/courses/', fetcher);

  return {
    courses: data?.data,
    isLoading: isLoading,
    error: error,
  };
}

export { useCourses };
