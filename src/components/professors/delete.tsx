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
import { ProfessorRowProps } from '@/interfaces';
import { useSWRConfig } from 'swr';

const DeleteModal = ({
  isOpen,
  onClose,
  rowData,
}: // setData,
{
  isOpen: boolean;
  onClose: () => void;
  rowData: Row<ProfessorRowProps>;
  // setData: React.Dispatch<React.SetStateAction<ProfessorRowProps[]>>;
}) => {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const handleDelete = async (row: Row<ProfessorRowProps>) => {
    try {
      const response = await apiInstance({}).delete(
        `/professor/${rowData.original?.id}`
      );
      mutate('/professor/');
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
          <Text>Are you sure you want to delete this professor?</Text>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="space-between" w="full">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => handleDelete(rowData)}>
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
