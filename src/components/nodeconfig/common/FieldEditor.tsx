import { Box, Button, Checkbox, Flex, Grid, Text } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import { Models } from '@/models';

interface FieldEditorProps {
  field: Models.Field;
  index: number;
  onUpdate: (updates: Partial<Models.Field>) => void;
  onRemove: () => void;
  errors: Record<string, string | undefined>;
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
];

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  onUpdate,
  onRemove,
  errors,
}) => {
  const fieldNameError = errors[`fields_${field.id}_name`];

  return (
    <Box p="4" style={{ background: 'var(--gray-a2)' }}>
      <Flex align="center" justify="between" mb="3">
        <Text weight="medium" color="gray">
          Field {index + 1}
        </Text>
        <Button
          color="red"
          variant="ghost"
          size="1"
          onClick={onRemove}
          aria-label={`Remove field ${index + 1}`}
        >
          <Trash2 size={16} />
        </Button>
      </Flex>

      <Grid columns={{ initial: '1', md: '2' }} gap="4">
        <FormField
          label="Field Name"
          id={`field_${field.id}_name`}
          value={field.name}
          onChange={(value) => onUpdate({ name: value })}
          placeholder="Enter field name"
          error={fieldNameError}
          required
        />

        <FormSelect
          label="Field Type"
          id={`field_${field.id}_type`}
          value={field.type}
          onChange={(value) => onUpdate({ type: value as Models.FormFieldType })}
          options={fieldTypeOptions}
          required
        />
      </Grid>

      <Flex align="center" mt="3">
        <Checkbox
          checked={field.required}
          onCheckedChange={(checked) => onUpdate({ required: !!checked })}
          id={`field_${field.id}_required`}
          mr="2"
        />
        <Text as="label" size="2" htmlFor={`field_${field.id}_required`}>
          Required field
        </Text>
      </Flex>
    </Box>
  );
};
