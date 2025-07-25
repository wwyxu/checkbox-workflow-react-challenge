import { HttpTypes } from "@/constants";
import { Validation } from "@/models";
import { validateURL } from "@/validation/common";
import { validateWithSchema } from "./Schema";

export const apiNodeSchema: Validation.Schema = {
    fields: [
        {
            key: "nodeName",
            validators: [
                (val) => (!val?.trim() ? "Node name is required" : undefined)
            ]
        },
        {
            key: "httpMethod",
            validators: [
                (val) =>
                    val.trim() !== HttpTypes.POST && val.trim() !== HttpTypes.PUT
                        ? "Invalid HTTP Method"
                        : undefined
            ]
        },
        {
            key: "url",
            validators: [
                (val) => (!val?.trim() ? "URL is required" : undefined),
                (val) => (val && !validateURL(val) ? "Please enter a valid URL" : undefined)
            ]
        }
    ]
};

export function validateApiNodeConfig(nodeName: string, httpMethod: string, url: string) {
    return validateWithSchema(apiNodeSchema, { nodeName, httpMethod, url });
}
