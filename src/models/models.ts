import { ConditionalNodeOperatorTypes, FormFieldTypes, HttpTypes, ModalTypes } from '@/constants';

export declare namespace Models {
  type httpMethod = HttpTypes.POST | HttpTypes.PUT;
  type ConditionalNodeOperator =
    | ConditionalNodeOperatorTypes.EQUALS
    | ConditionalNodeOperatorTypes.NOT_EQUALS
    | ConditionalNodeOperatorTypes.IS_EMPTY;
  type FormFieldType = FormFieldTypes.TEXT | FormFieldTypes.EMAIL | FormFieldTypes.NUMBER;
  type ModalType = ModalTypes.NONE | ModalTypes.NODE | ModalTypes.SAVE;

  // Form field definition for Form Nodes
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
