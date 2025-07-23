import { validateFormNodeConfig } from '@/validation/forms/FormNodeConfig';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Select,
  Text,
  TextField,
  Theme
} from '@radix-ui/themes';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ErrorAlert } from './common/ErrorAlert';
import { ModalFooter } from './common/ModalFooter';

// Type definitions
type FieldType = 'text' | 'email' | 'number';

interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
}

interface FormNodeConfigProps {
  node?: any;
  onSave: (node: any) => void;
  onClose: () => void;
}

interface ValidationErrors {
  nodeName?: string;
  fields?: string;
  [key: string]: string | undefined;
}

const FormNodeConfig: React.FC<FormNodeConfigProps> = ({ node, onSave, onClose }) => {
  const [nodeName, setNodeName] = useState<string>(node?.data.name || '');
  const [fields, setFields] = useState<Field[]>(node?.data.fields || []);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const addField = (): void => {
    const newField: Field = {
      id: `f${Date.now()}`,
      name: '',
      type: 'text',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string): void => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<Field>): void => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors = validateFormNodeConfig(nodeName, fields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (): void => {
    if (validateForm()) {
      onSave({
        ...node,
        data: {
          ...node.data,
          name: nodeName,
          fields: fields,
        },
      });
    }
  };

  return (
    <Theme>
      <Box>
        {/* Node Name */}
        <Box mb="4">
          <Text as="label" size="2" weight="medium" mb="1" htmlFor="nodeName">
            Node Name
          </Text>
          <TextField.Root
            id="nodeName"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter node name"
          />
          {errors.nodeName &&
            <ErrorAlert>{errors.nodeName}</ErrorAlert>
          }
        </Box>

        {/* Fields Header & Add Field */}
        <Flex align="end" justify="between" mb="2" mt="2">
          <Text as="label" size="2" weight="medium">
            Fields
          </Text>
          <Button color="blue" onClick={addField} variant="solid">
            <Plus size={16} style={{ marginRight: 4 }} />
            Add Field
          </Button>
        </Flex>

        <Flex direction="column" gap="4">
          {fields.map((field, index) => (
            <Box key={field.id} p="4" style={{ background: "var(--gray-a2)" }}>
              <Flex align="center" justify="between" mb="3">
                <Text weight="medium" color="gray">
                  Field {index + 1}
                </Text>
                <Button
                  color="red"
                  variant="ghost"
                  size="1"
                  onClick={() => removeField(field.id)}
                  aria-label={`Remove field ${index + 1}`}
                >
                  <Trash2 size={16} />
                </Button>
              </Flex>

              <Grid columns={{ initial: "1", md: "2" }} gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" htmlFor={`field_${field.id}_name`} mb="1">
                    Field Name
                  </Text>
                  <TextField.Root
                    id={`field_${field.id}_name`}
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    placeholder="Enter field name"
                  />
                  {errors[`field_${field.id}_name`] && (
                    <ErrorAlert>{errors[`field_${field.id}_name`]}</ErrorAlert>
                  )}
                </Box>
                <Box>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium" htmlFor={`field_${field.id}_type`}>
                      Field Type
                    </Text>
                    <Select.Root
                      value={field.type}
                      onValueChange={(v) => updateField(field.id, { type: v as FieldType })}
                    >
                      <Select.Trigger id={`field_${field.id}_type`} />
                      <Select.Content>
                        <Select.Item value="text">Text</Select.Item>
                        <Select.Item value="email">Email</Select.Item>
                        <Select.Item value="number">Number</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Box>
              </Grid>
              <Flex align="center" mt="3">
                <Checkbox
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField(field.id, { required: !!checked })
                  }
                  id={`field_${field.id}_required`}
                  mr="2"
                />
                <Text as="label" size="2" htmlFor={`field_${field.id}_required`}>
                  Required field
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>

        {errors.fields &&
          <ErrorAlert>{errors.fields}</ErrorAlert>
        }

        <ModalFooter
          onSave={handleSave}
          onClose={onClose}
        />
      </Box>
    </Theme>
  );
};

export default FormNodeConfig;