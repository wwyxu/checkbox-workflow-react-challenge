export declare namespace Validation {
  export interface ValidationErrors {
    nodeName?: string;
    url?: string;
    httpMethod?: string;
    fields?: string;
  }

  /**
   * Type for a field validation function
   */
  export type ValidatorFn = (value: any, allValues?: any) => string | undefined;

  /**
   * Schema field definition
   */
  export interface SchemaField {
    key: string;
    validators: ValidatorFn[];
  }

  /**
   * Schema definition
   */
  export interface Schema {
    fields: SchemaField[];
    itemValidators?: {
      [key: string]: ValidatorFn[];
    };
  }
}
