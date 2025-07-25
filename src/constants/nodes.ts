enum NodeTypes {
  START = 'start',
  FORM = 'form',
  CONDITIONAL = 'conditional',
  API = 'api',
  END = 'end',
}

enum HttpTypes {
  POST = 'POST',
  PUT = 'PUT',
}

enum FormFieldTypes {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
}

enum ConditionalNodeOperatorTypes {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  IS_EMPTY = 'is_empty',
}

enum ModalTypes {
  NONE = 'none',
  NODE = 'node',
  SAVE = 'save',
}

export { NodeTypes, HttpTypes, FormFieldTypes, ConditionalNodeOperatorTypes, ModalTypes };
