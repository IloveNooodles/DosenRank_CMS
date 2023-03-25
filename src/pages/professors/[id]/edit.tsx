import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import {
  Course,
  FormikEditProfessorProps,
  Professor,
  ProfessorResponse,
  SelectOption,
  University,
  UniversityResponse,
} from '@/interfaces';
import { apiInstance } from '@/utils/apiInstance';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Icon,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { Formik, Form, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { useSWRConfig } from 'swr';

interface EditProfessorPageContext {
  params: {
    id: string;
  };
}

export async function getServerSideProps(context: EditProfessorPageContext) {
  const { id } = context.params;
  try {
    const professor = await apiInstance({}).get(`/professor/${id}`);
    const universities = await apiInstance({}).get('/univ/');
    const courses = await apiInstance({}).get('/courses/');
    const profCourses = await apiInstance({}).get(
      `/courses/professor?id=${id}`
    );

    const professorData: ProfessorResponse = professor.data;
    const universitiesData: UniversityResponse = universities.data;
    const _courses = courses.data.data;
    const _profCourses = profCourses.data.data;

    const coursesData: Course[] = _courses.map((course: any) => ({
      ...course,
      courseId: course.course_id,
      name: course.course_name,
      institutionId: course.institute_id,
      institutionName: course.institution_name,
    }));
    const profCoursesData: Course[] = _profCourses?.map((course: any) => ({
      ...course,
      courseId: course.course_id,
      name: course.course_name,
      institutionId: course.institute_id,
      institutionName: course.institution_name,
    }));

    return {
      props: {
        professor: professorData.data,
        universities: universitiesData.data,
        courses: coursesData,
        profCourses: _profCourses ? profCoursesData : [],
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
  professor: Professor;
  universities: University[];
  courses: Course[];
  profCourses: Course[];
}

const Edit = ({ professor, universities, courses, profCourses }: EditProps) => {
  const universityOption: Array<SelectOption> = universities.map(
    ({ id, name }) => ({ label: name, value: id.toString() })
  );
  const courseOption: Array<SelectOption> = courses.map(
    ({ course_id, course_name }) => ({
      label: `${course_id} ${course_name}`,
      value: course_id.toString(),
    })
  );
  const { mutate } = useSWRConfig();

  const [isEdit, setIsEdit] = React.useState(false);
  const [editBtnText, setEditBtnText] = React.useState('Edit Mata Kuliah');
  const [tempProfCourses, setTempProfCourses] =
    React.useState<Course[]>(profCourses);
  const {
    isOpen: isOpenAddCourse,
    onOpen: onOpenAddCourse,
    onClose: onCloseAddCourse,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (isEdit) {
      setEditBtnText('Selesai Edit Mata Kuliah');
    } else {
      setEditBtnText('Edit Mata Kuliah');
    }
  }, [isEdit]);

  const handleEditBtn = () => {
    setIsEdit(!isEdit);
  };

  // tested worked
  const handleAddCourse = async (courseId: number) => {
    if (courseId !== undefined && courseId !== -1) {
      const ifExist = tempProfCourses.find(
        (course) => course.course_id === courseId
      );

      if (ifExist === undefined) {
        const addedCourse = courses.find(
          (course) => course.course_id === courseId
        );
        if (addedCourse !== undefined) {
          try {
            const res = await apiInstance({}).post('/profcourse/', {
              professor_Id: professor.id,
              course_Id: addedCourse.id,
            });

            setTempProfCourses([...tempProfCourses, addedCourse]);

            toast({
              title: 'Mata kuliah berhasil ditambahkan',
              description: res.data.message,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });

            onCloseAddCourse();
          } catch (err) {
            // untested error
            if (axios.isAxiosError(err)) {
              toast({
                title: err.response?.data.error,
                description: err.response?.data.message,
                status: 'success',
                duration: 2000,
                isClosable: true,
              });
            }
          }
        }
      } else {
        toast({
          title: 'Gagal menambahkan mata kuliah',
          description: 'Dosen sudah mengajar mata kuliah ini',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  // TODO: wait for be endpoint
  const handleDeleteCourse = (courseId: number) => {
    toast({
      title: `Deleteing ${courseId} ...`,
      description: 'BE is not ready yet',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
    // setTempProfCourses(
    //   tempProfCourses.filter((course) => course.courseId !== courseId)
    // );
  };

  const handleReset = () => {
    setIsEdit(false);
    setEditBtnText('Edit Mata Kuliah');
  };

  return (
    <Flex bgColor={'white'} p="4" borderRadius={'lg'} flexDirection="column">
      <Text fontSize={'lg'} fontWeight="semibold">
        Edit Professor
      </Text>
      <Divider my="4" />
      <Formik
        initialValues={{ ...professor, newCourse: -1 }}
        onSubmit={async (values) => {
          const profData = JSON.stringify({
            id: values.id,
            name: values.name,
            institutionId: Number(values.institutionId),
          });

          try {
            const res = await apiInstance({}).put(
              `/professor/${values.id}`,
              profData
            );
            mutate('/professor/');
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
        {(props: FormikProps<FormikEditProfessorProps>) => (
          <Form>
            <VStack spacing={4} alignItems="flex-start">
              <TextInput
                id="name"
                name="name"
                label="Name"
                type="text"
                placeholder="Name"
                value={props.values.name}
              />
              <SelectInput
                id="institutionId"
                name="institutionId"
                label="Universitas"
                defaultInputValue={props.values.institutionName}
                placeholder="Universitas"
                options={universityOption}
              />
              <Flex
                flexDir={'column'}
                border="1px"
                borderColor={'gray.300'}
                borderRadius="lg"
                p="4"
                w="full"
              >
                <Text fontWeight={'bold'}>Mata kuliah yang diajar dosen:</Text>
                {tempProfCourses.map((course) => (
                  <Flex
                    key={course.course_id}
                    justifyContent="space-between"
                    mt="3"
                  >
                    <Text>
                      {course.course_id} {course.course_name}
                    </Text>
                    {isEdit ? (
                      <Icon
                        as={CloseIcon}
                        onClick={() => handleDeleteCourse(course.course_id)}
                      />
                    ) : null}
                  </Flex>
                ))}
                {isEdit ? (
                  <Flex flexDirection={'column'}>
                    <Modal isOpen={isOpenAddCourse} onClose={onCloseAddCourse}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Tambah mata kuliah</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <SelectInput
                            id="newCourse"
                            name="newCourse"
                            placeholder="Mata kuliah"
                            options={courseOption}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button mr={3} onClick={onCloseAddCourse}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="teal"
                            onClick={() =>
                              handleAddCourse(props.values.newCourse)
                            }
                          >
                            Add
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    <Button
                      mt="4"
                      colorScheme={'teal'}
                      onClick={onOpenAddCourse}
                    >
                      Tambah mata kuliah
                    </Button>
                  </Flex>
                ) : null}
                <Button
                  mt="3"
                  colorScheme={
                    editBtnText === 'Edit Mata Kuliah' ? 'teal' : 'gray'
                  }
                  onClick={handleEditBtn}
                >
                  {editBtnText}
                </Button>
              </Flex>
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
