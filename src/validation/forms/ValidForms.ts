import { NodeTypes } from "@/constants";
import { validateFormNodeConfig } from "./FormNodeConfig";
import { validateApiNodeConfig } from "./ApiNodeConfig";

const validateForms = (nodes) => {
    const errors = [];

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        if (node.type === NodeTypes.FORM || node.type === NodeTypes.API) {
            const formErrors = node.type === NodeTypes.FORM ? validateFormNodeConfig(node.data.label, node.data.fields) : validateApiNodeConfig(node.data.label, node.data.endpoint);
            if (Object.keys(formErrors).length > 0) {
                errors.push(`Node ${node.id} : ${Object.values(formErrors).join(', ')}`);
            }
        }
    }

    return errors;
};

export { validateForms };
