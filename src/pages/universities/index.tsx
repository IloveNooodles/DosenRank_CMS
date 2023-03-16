import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUniversities } from "@/services";
import { Form, Formik } from "formik";
import TextInput from "@/components/TextInput";
import { Button, Flex } from "@chakra-ui/react";

interface UniversitiesProps {}

const Universities = (props: UniversitiesProps) => {
  const { universities, isLoading, isError } = useUniversities();

  return (
    <Flex bgColor="red.100">
      <p>{JSON.stringify(universities)}</p>
      <div>
        universities <Link href="/">link</Link>
      </div>
      <Formik
        initialValues={{ universities: "" }}
        onSubmit={async (values) => {
          const data = JSON.stringify({
            universities: values.universities,
          });
        }}
      >
        <Form>
          <TextInput
            id="universities"
            name="universities"
            type="text"
            placeholder="Universities"
          />
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </Form>
      </Formik>
    </Flex>
  );
};

export default Universities;
