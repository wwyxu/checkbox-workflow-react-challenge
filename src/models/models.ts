import { ConditionalNodeOperatorTypes, FormFieldTypes, HttpTypes, ModalTypes } from "@/constants";

export declare namespace Models {
    type httpMethod = HttpTypes.POST | HttpTypes.PUT;
    type ConditionalNodeOperator = ConditionalNodeOperatorTypes.EQUALS | ConditionalNodeOperatorTypes.NOT_EQUALS | ConditionalNodeOperatorTypes.IS_EMPTY;
    type FormFieldType = FormFieldTypes.TEXT | FormFieldTypes.EMAIL | FormFieldTypes.NUMBER;
    type ModalType = ModalTypes.NONE | ModalTypes.NODE | ModalTypes.SAVE;

    // Validation error messages for nodes
    export interface ValidationErrors {
        nodeName?: string;
        url?: string;
        httpMethod?: string;
        fields?: string;
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

    export interface Field {
        id: string;
        name: string;
        type: FormFieldType;
        required: boolean;
    }
}
