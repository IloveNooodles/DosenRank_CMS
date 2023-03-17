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
import axios, { AxiosError } from "axios";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const Create = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();

  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new university</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{ universities: "" }}
              validationSchema={Yup.object({
                universities: Yup.string().required("Required"),
              })}
              onSubmit={async (values) => {
                const data = JSON.stringify({
                  name: values.universities,
                });

                try {
                  const response = await apiInstance({}).post("/univ/", data);
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
                    w="full"
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

export default Create;
