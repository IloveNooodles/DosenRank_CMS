import { apiInstance } from "@/utilities/apiInstance";
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
} from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { UniversitiesProps } from "../../pages/universities";

const DeleteModal = ({
  isOpen,
  onClose,
  rowData,
  setData,
}: {
  isOpen: boolean;
  onClose: () => void;
  rowData: Row<UniversitiesProps>;
  setData: React.Dispatch<React.SetStateAction<UniversitiesProps[]>>;
}) => {
  const toast = useToast();

  const handleDelete = async (row: Row<UniversitiesProps>) => {
    try {
      const response = await apiInstance({}).delete(
        `/univ/${rowData.original?.id}`
      );
      setData((prev) => {
        const newData = prev.filter((item) => item.id !== rowData.original?.id);
        return newData;
      });
      onClose();
      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          description: error.response?.data.error,
          status: "error",
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
          <Text>Are you sure you want to delete this university?</Text>
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
