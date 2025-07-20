export declare namespace Models {
    interface Field {
    id: string;
    name: string;
    type: string;
    required?: boolean;
    nodeName?: string;
    nodeId?: string;
    }

    // interface WorkflowNode {
    // id: string;
    // name: string;
    // type: string;
    // fields?: Field[];
    // }

    // interface Workflow {
    // nodes: WorkflowNode[];
    // }

    // interface APINode {
    // id?: string;
    // name?: string;
    // httpMethod?: 'POST' | 'PUT';
    // url?: string;
    // selectedFields?: string[];
    // }

    // interface APINodeConfigProps {
    // node?: APINode;
    // onSave: (node: APINode) => void;
    // workflow: Workflow;
    // }

    interface ValidationErrors {
    nodeName?: string;
    url?: string;
    }
}
