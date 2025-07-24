import {
  Box,
  Button,
  Flex,
  Text
} from '@radix-ui/themes';
import { Plus } from 'lucide-react';
import React from 'react';
import { ErrorAlert } from './ErrorAlert';
import { FieldEditor } from './FieldEditor';

// Type definitions
type FieldType = 'text' | 'email' | 'number';

interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
}

interface FieldsListProps {
  fields: Field[];
  onAddField: () => void;
  onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
  onRemoveField: (fieldId: string) => void;
  errors: Record<string, string | undefined>;
}

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  errors
}) => {
  return (
    <>
      {/* Fields Header & Add Field */}
      <Flex align="end" justify="between" mb="2" mt="2">
        <Text as="label" size="2" weight="medium">
          Fields
        </Text>
        <Button color="blue" onClick={onAddField} variant="solid">
          <Plus size={16} style={{ marginRight: 4 }} />
          Add Field
        </Button>
      </Flex>

      {/* Fields List */}
      <Flex direction="column" gap="4">
        {fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            index={index}
            onUpdate={(updates) => onUpdateField(field.id, updates)}
            onRemove={() => onRemoveField(field.id)}
            errors={errors}
          />
        ))}
      </Flex>

      {/* Fields validation error */}
      {errors.fields && (
        <ErrorAlert>{errors.fields}</ErrorAlert>
      )}
    </>
  );
};
