export declare namespace Models {
    interface Field {
        id: string;
        name: string;
        type: string;
        required?: boolean;
        nodeName?: string;
        nodeId?: string;
    }

    interface ValidationErrors {
        nodeName?: string;
        url?: string;
    }
}
