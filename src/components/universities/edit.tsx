import TextInput from "@/components/TextInput";
import { apiInstance } from "@/utilities/apiInstance";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { UniversitiesProps } from "../../pages/universities";

interface UnivEditProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Row<UniversitiesProps>;
  setData: React.Dispatch<React.SetStateAction<UniversitiesProps[]>>;
}

const Edit = ({ rowData, isOpen, onClose, setData }: UnivEditProps) => {
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit university</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Formik
            initialValues={{ universities: rowData.original?.name || "" }}
            validationSchema={Yup.object({
              universities: Yup.string().required("Required"),
            })}
            onSubmit={async (values) => {
              const data = JSON.stringify({
                name: values.universities,
              });

              try {
                const response = await apiInstance({}).put(
                  `/univ/${rowData.original?.id}`,
                  data
                );
                setData((prev) => {
                  const newData = prev.map((item) => {
                    if (item.id === rowData.original?.id) {
                      return {
                        ...item,
                        name: values.universities,
                      };
                    }
                    return item;
                  });
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
            }}
          >
            <Form>
              <VStack spacing={4} alignItems="flex-start">
                <TextInput
                  id="universities"
                  name="universities"
                  label="University Name"
                  type="text"
                  placeholder="Universities"
                />
                <Button type="submit" colorScheme="teal">
                  Submit
                </Button>
              </VStack>
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Edit;
