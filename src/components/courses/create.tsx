import TextInput from '@/components/TextInput';
import {
  CourseRowProps,
  ProfessorRowProps,
  SelectOption,
  University,
} from '@/interfaces';
import { apiInstance } from '@/utils/apiInstance';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useSWRConfig } from 'swr';
import * as Yup from 'yup';
import SelectInput from '../SelectInput';

interface CourseCreateProps {
  isOpen: boolean;
  onClose: () => void;
  universities: University[] | undefined;
}

const Create = ({ isOpen, onClose, universities }: CourseCreateProps) => {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const universityOption: Array<SelectOption> | undefined = universities?.map(
    ({ id, name }) => ({ label: name, value: id.toString() })
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambahkan mata kuliah</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Formik
            initialValues={{ name: '', courseId: '', institutionId: '' }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              courseId: Yup.string().required('Required'),
              institutionId: Yup.string().required('Required'),
            })}
            onSubmit={async (values) => {
              const data = JSON.stringify({
                institute_id: Number(values.institutionId),
                course_id: values.courseId,
                course_name: values.name,
              });

              try {
                const response = await apiInstance({}).post('/courses/', data);
                mutate('/courses/');
                onClose();
                toast({
                  title: response.data.message,
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
            <Form>
              <VStack spacing={4} alignItems="flex-start">
                <TextInput
                  id="name"
                  name="name"
                  label="Nama mata kuliah"
                  type="text"
                  w="full"
                />
                <TextInput
                  id="courseId"
                  name="courseId"
                  label="Kode mata kuliah"
                  type="text"
                  w="full"
                />
                <SelectInput
                  id="institutionId"
                  name="institutionId"
                  label="Universitas"
                  placeholder="Universitas"
                  options={universityOption || []}
                />
                <Flex justifyContent="space-between" w="full">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type="submit" colorScheme="teal">
                    Submit
                  </Button>
                </Flex>
              </VStack>
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Create;
