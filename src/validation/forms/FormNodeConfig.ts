import { Validation } from "@/models";
import { validateWithSchema } from "./Schema";

export const formNodeSchema: Validation.Schema = {
  fields: [
    {
      key: "nodeName",
      validators: [
        (val) => (!val?.trim() ? "Node name is required" : undefined)
      ]
    },
    {
      key: "fields",
      validators: [
        (val) => (Array.isArray(val) && val.length === 0 ? "At least one field must be configured" : undefined)
      ]
    }
  ],
  itemValidators: {
    fields: [
      (_, item) => (!item.name?.trim() ? "Field name is required" : undefined)
    ]
  }
};

export function validateFormNodeConfig(nodeName: string, fields: any[] ) {
  return validateWithSchema(formNodeSchema, { nodeName, fields });
}
