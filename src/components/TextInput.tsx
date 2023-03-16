import { useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput } from '@chakra-ui/react';
import { InputProps as ChakraInputProps } from "@chakra-ui/react";

interface TextFieldProps extends ChakraInputProps {
    name: string;
    label?: string;
  }

const TextInput: React.FC<TextFieldProps> = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  
  return (
    <FormControl isInvalid={!!(meta.touched && meta.error)}>
      {label ? <FormLabel htmlFor={props.id}>
        {label}
      </FormLabel> : null}
      <ChakraInput {...field} {...props} bgColor="white" />
      {meta.touched && meta.error ? (
         <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default TextInput