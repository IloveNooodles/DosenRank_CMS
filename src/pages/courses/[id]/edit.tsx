import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import {
  Course,
  SelectOption,
  University,
  UniversityResponse,
  Response,
} from '@/interfaces';
import { apiInstance } from '@/utils/apiInstance';
import {
  Button,
  Flex,
  Text,
  VStack,
  useToast,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { Formik, Form, FormikProps } from 'formik';
import { useSWRConfig } from 'swr';

interface EditCoursePageContext {
  params: {
    id: string;
  };
}

export async function getServerSideProps(context: EditCoursePageContext) {
  const { id } = context.params;
  try {
    const course = await apiInstance({}).get(`/courses/${id}`);
    const universities = await apiInstance({}).get('/univ/');

    const courseData: Response<Course> = course.data;
    const universitiesData: UniversityResponse = universities.data;

    // const courseData = map(_courseData.data, (course: any) => ({
    //   courseId: course.course_id,
    //   name: course.course_name,
    //   univId: course.institute_id,
    //   univName: course.institute_name,
    // }));

    return {
      props: {
        course: courseData.data,
        universities: universitiesData.data,
        // courses: coursesData,
        // profCourses: _profCourses ? profCoursesData : [],
      },
    };
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

interface EditProps {
  course: Course;
  universities: University[];
}

const Edit = ({ course, universities }: EditProps) => {
  const universityOption: Array<SelectOption> = universities.map(
    ({ id, name }) => ({ label: name, value: id.toString() })
  );

  const toast = useToast();
  const { mutate } = useSWRConfig();

  const handleReset = () => {
    toast({
      title: 'Reset',
      description: 'Resetting form data',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex bgColor={'white'} p="4" borderRadius={'lg'} flexDirection="column">
      <Text fontSize={'lg'} fontWeight="semibold">
        Edit Mata Kuliah
      </Text>
      <Divider my="4" />
      <Formik
        initialValues={{ ...course }}
        onSubmit={async (values) => {
          const courseData = JSON.stringify({
            institute_Id: Number(values.institute_id),
            course_id: values.course_id,
            course_name: values.course_name,
          });

          try {
            const res = await apiInstance({}).put(
              `/courses/${values.id}`,
              courseData
            );
            mutate('/courses/');
            toast({
              title: res.data.message,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          } catch (error) {
            if (axios.isAxiosError(error)) {
              toast({
                title: error.response?.data.message,
                description: error.response?.data.error,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
          }
        }}
      >
        {(props: FormikProps<Course>) => (
          <Form>
            <VStack spacing={4} alignItems="flex-start">
              <TextInput
                id="course_name"
                name="course_name"
                label="Nama Mata Kuliah"
                type="text"
                value={props.values.course_name}
              />
              <TextInput
                id="course_id"
                name="course_id"
                label="Nama Mata Kuliah"
                type="text"
                value={props.values.course_id}
              />
              <SelectInput
                id="institute_id"
                name="institute_id"
                label="Universitas"
                defaultInputValue={props.values.institution_name}
                placeholder="Universitas"
                options={universityOption}
              />
              <Flex justifyContent="space-between" w="full">
                <Button onClick={handleReset}>Reset</Button>
                <Button type="submit" colorScheme="teal">
                  Save
                </Button>
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default Edit;
