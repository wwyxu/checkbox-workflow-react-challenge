import { FormFieldTypes } from '@/constants';
import { Models, Validation } from '@/models';
import { validateFormNodeConfig } from '@/validation/forms/FormNodeConfig';
import { Box, Theme } from '@radix-ui/themes';
import React, { useState } from 'react';
import { ModalFooter } from '../common/ModalFooter';
import { FieldsList } from './common/FieldsList';
import { FormField } from './common/FormField';

interface FormNodeConfigProps {
  node?: any;
  onSave: (node: any) => void;
  onClose: () => void;
}

const FormNodeConfig: React.FC<FormNodeConfigProps> = ({ node, onSave, onClose }) => {
  const [nodeName, setNodeName] = useState<string>(node?.data.name || '');
  const [fields, setFields] = useState<Models.Field[]>(node?.data.fields || []);
  const [errors, setErrors] = useState<Validation.ValidationErrors>({});

  const addField = (): void => {
    const newField: Models.Field = {
      id: `f${Date.now()}`,
      name: '',
      type: FormFieldTypes.TEXT,
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string): void => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<Models.Field>): void => {
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
          <FormField
            label="Node Name"
            id="nodeName"
            value={nodeName}
            onChange={setNodeName}
            placeholder="Enter node name"
            error={errors.nodeName}
            required
          />
        </Box>

        {/* Fields Management */}
        <FieldsList
          fields={fields}
          onAddField={addField}
          onUpdateField={updateField}
          onRemoveField={removeField}
          errors={errors as any}
        />

        <ModalFooter
          onSave={handleSave}
          onClose={onClose}
        />
      </Box>
    </Theme>
  );
};

export default FormNodeConfig;
