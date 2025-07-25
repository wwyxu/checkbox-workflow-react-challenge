import { Box, Text, Flex } from '@radix-ui/themes';
import { AlertCircle } from 'lucide-react';
import { Models } from '@/models';
import { FieldCheckboxItem } from './FieldCheckBoxItem';

interface FieldSelectorProps {
  fields: Models.FormField[];
  selectedFields: string[];
  label: string;
  onFieldToggle: (fieldId: string) => void;
  emptyMessage?: string;
}

export const FieldSelector = ({
  fields,
  selectedFields,
  label,
  onFieldToggle,
  emptyMessage = 'No fields available',
}: FieldSelectorProps) => (
  <Box>
    <Text as="label" size="2" weight="medium" mb="2">
      {label}
    </Text>
    {fields.length === 0 ? (
      <Box p="3" style={{ background: 'var(--gray-a2)' }}>
        <Flex direction="column" align="center" py="6">
          <AlertCircle size={24} color="var(--gray-a6)" />
          <Text color="gray" mt="2" size="2">
            {emptyMessage}
          </Text>
        </Flex>
      </Box>
    ) : (
      <Flex direction="column" gap="2">
        {fields.map((field) => (
          <FieldCheckboxItem
            key={field.id}
            field={field}
            isSelected={selectedFields.includes(field.id)}
            onToggle={() => onFieldToggle(field.id)}
          />
        ))}
      </Flex>
    )}
  </Box>
);
