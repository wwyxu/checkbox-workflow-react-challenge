import { Box, Text, Select, Flex } from '@radix-ui/themes';
import { ErrorAlert } from './ErrorAlert';
import { selectState } from '@/utils/selectState'; // Adjust the import path as necessary

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
}

export const FormSelect = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
  required = false,
}: FormSelectProps) => {
  const handleOpenChange = (open: boolean) => {
    if (open) {
      selectState.setTrue();
    } else {
      setTimeout(() => {
        selectState.setFalse();
      }, 100);
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="1">
        <Text as="label" size="2" weight="medium" htmlFor={id}>
          {label} {required && <Text color="red">*</Text>}
        </Text>
        <Select.Root value={value} onValueChange={onChange} onOpenChange={handleOpenChange}>
          <Select.Trigger id={id} />
          <Select.Content>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </Flex>
    </Box>
  );
};
