import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useField } from 'formik';
import { SelectFieldProps } from '@/interfaces';

/* eslint-disable */
const SelectInput: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  ...props
}) => {
  const [field, meta, helper] = useField(name);

  return (
    <FormControl isInvalid={!!(meta.touched && meta.error)}>
      {label ? <FormLabel htmlFor={props.id}>{label}</FormLabel> : null}
      <Select
        id={props.id}
        instanceId={props.id}
        name={field.name}
        placeholder={props.placeholder}
        options={options}
        closeMenuOnSelect={true}
        defaultInputValue={props.defaultInputValue}
        value={
          options
            ? options.find((option) => option.value === field.value)
            : null
        }
        onChange={(option) => helper.setValue(option!.value)}
        onBlur={field.onBlur}
      />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default SelectInput;
