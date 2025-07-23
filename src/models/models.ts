import { ConditionalNodeOperatorTypes, FormFieldTypes, HttpTypes } from "@/constants";

export declare namespace Models {
    type httpMethod = HttpTypes.POST | HttpTypes.PUT;
    type ConditionalNodeOperator = ConditionalNodeOperatorTypes.EQUALS | ConditionalNodeOperatorTypes.NOT_EQUALS | ConditionalNodeOperatorTypes.IS_EMPTY;
    type FormFieldType = FormFieldTypes.TEXT | FormFieldTypes.EMAIL | FormFieldTypes.NUMBER;

    // Validation error messages for nodes
    export interface ValidationErrors {
        nodeName?: string;
        url?: string;
    }

    // API Node data, supporting GET/POST and request body
    export interface ApiNodeData {
        label: string;
        customName?: string;
        httpMethod?: httpMethod;
        url?: string;
        requestBody?: Record<string, string>;
    }

    // Conditional node data for logic branching
    export interface ConditionalNodeData {
        label: string;
        customName?: string;
        fieldToEvaluate?: string;
        operator?: ConditionalNodeOperator;
        value?: string;
    }

    // End node with just a label
    export interface EndNodeData {
        label: string;
    }

    // Form field definition for form nodes
    export interface FormField {
        id: string;
        name: string;
        type: FormFieldType;
        required?: boolean;
        nodeName?: string;
        nodeId?: string;
    }

    // Form node data with list of form fields
    export interface FormNodeData {
        label: string;
        customName?: string;
        fields?: FormField[];
    }

    // Start node interface, ready for extension
    export interface StartNodeData {
        label: string;
    }
}
