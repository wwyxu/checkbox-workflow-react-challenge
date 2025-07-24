import { Box, Text, TextField } from '@radix-ui/themes';
import { ErrorAlert } from './ErrorAlert';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: any;
  error?: string;
  required?: boolean;
}

export const FormField = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  error,
  required = false 
}: FormFieldProps) => (
  <Box>
    <Text as="label" size="2" weight="medium" mb="1" htmlFor={id}>
      {label} {required && <Text color="red">*</Text>}
    </Text>
    <TextField.Root
      id={id}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {error && <ErrorAlert>{error}</ErrorAlert>}
  </Box>
);
