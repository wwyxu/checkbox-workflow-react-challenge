import { Validation } from '@/models';

export function validateWithSchema(schema: Validation.Schema, values: Record<string, any>) {
  const errors: Validation.ValidationErrors = {};

  // Field-level validations
  schema.fields.forEach(({ key, validators }) => {
    const value = values[key];
    for (const validate of validators) {
      const error = validate(value, values);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  });

  // Array item-level validations (e.g., for fields array)
  if (schema.itemValidators) {
    Object.entries(schema.itemValidators).forEach(([arrayKey, validators]) => {
      const arr: any[] = values[arrayKey] || [];
      arr.forEach((item, idx) => {
        validators.forEach((validate) => {
          for (const itemField in item) {
            const error = validate(item[itemField], item);
            if (error) {
              errors[`${arrayKey}_${item.id || idx}_${itemField}`] = error;
            }
          }
        });
      });
    });
  }

  return errors;
}
