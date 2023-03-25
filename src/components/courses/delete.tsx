import { apiInstance } from '@/utils/apiInstance';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import { CourseRowProps } from '@/interfaces';
import { useSWRConfig } from 'swr';

const DeleteModal = ({
  isOpen,
  onClose,
  rowData,
}: {
  isOpen: boolean;
  onClose: () => void;
  rowData: Row<CourseRowProps>;
}) => {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    try {
      const response = await apiInstance({}).delete(
        `/courses/${rowData.original?.id}`
      );
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Apakah Anda yakin ingin menghapus mata kuliah ini?</Text>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="space-between" w="full">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
