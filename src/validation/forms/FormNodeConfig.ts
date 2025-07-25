import { Models } from "@/models";

const validateFormNodeConfig = (nodeName, fields) => {
    const newErrors: Models.ValidationErrors = {};

    if (!nodeName?.trim()) {
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

    return newErrors;
};

export { validateFormNodeConfig };
