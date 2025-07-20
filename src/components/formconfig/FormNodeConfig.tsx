import React, { useEffect, useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

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
}

interface ValidationErrors {
  nodeName?: string;
  fields?: string;
  [key: string]: string | undefined; // For dynamic field error keys like `field_${id}_name`
}

const FormNodeConfig: React.FC<FormNodeConfigProps> = ({ node, onSave }) => {
  const [nodeName, setNodeName] = useState<string>(node?.data.name || '');
  const [fields, setFields] = useState<Field[]>(node?.data.fields || []);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const addField = (): void => {
    const newField: Field = {
      id: `f${Date.now()}`,
      name: '',
      type: 'text',
      required: false
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string): void => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<Field>): void => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!nodeName.trim()) {
      newErrors.nodeName = 'Node name is required';
    }

    if (fields.length === 0) {
      newErrors.fields = 'At least one field must be configured';
    }

    fields.forEach((field) => {
      if (!field.name.trim()) {
        newErrors[`field_${field.id}_name`] = 'Field name is required';
      }
    });

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
          fields: fields
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Node Name</label>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.nodeName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          placeholder="Enter node name"
        />
        {errors.nodeName && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.nodeName}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">Fields</label>
          <button
            onClick={addField}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Field
          </button>
        </div>

        {errors.fields && (
          <div className="flex items-center gap-2 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{errors.fields}</p>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Field {index + 1}</h4>
                <button
                  onClick={() => removeField(field.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label={`Remove field ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors[`field_${field.id}_name`] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter field name"
                  />
                  {errors[`field_${field.id}_name`] && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors[`field_${field.id}_name`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Required field</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FormNodeConfig;