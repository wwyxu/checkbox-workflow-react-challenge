import { HttpTypes, NodeTypes } from "@/constants";
import { Models } from "@/models";

const createNewNode = (id: number, type: string, position) => {
    const newNode = {
        id: `${id}`,
        type,
        position,
        data: {
            label: `${type} node`,
            ...(type === NodeTypes.FORM && { fields: [] }),
            ...(type === NodeTypes.CONDITIONAL && { conditions: [] }),
            ...(type === NodeTypes.API && { endpoint: '', method: HttpTypes.POST, selectedFields: [] }),
        },
    };
    
    return newNode;
};

function getImmediatePrecedingFormNodes(nodeId, nodes, edges) {
    const errors = [];

    const targetNode = nodes.find(node => node.id === nodeId);
    if (!targetNode) {
        return errors;
    }

    // Find edges that directly connect to the target node
    const incomingEdges = edges.filter(edge => edge.target === nodeId);

    // Get the source node IDs from these direct edges
    const immediateSourceIds = incomingEdges.map(edge => edge.source);

    // Filter for Form nodes only from the immediate predecessors
    const formNodes = nodes.filter(node =>
        immediateSourceIds.includes(node.id) &&
        node.type === 'form' // Assuming 'form' is the type identifier
    ).flatMap(w =>
        (w.data.fields as Models.FormField[]).map((field) => ({
            ...field,
            nodeName: w.data.label,
            nodeId: w.id,
        }))
    );

    return formNodes;
}

function removeSelectedFieldsFromIsolatedApiNodes(nodes, edges) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        return [];
    }

    const nodesWithIncomingEdges = new Set(edges.map(edge => edge.target));

    return nodes.map(node => {
        if (!nodesWithIncomingEdges.has(node.id) && node.type === NodeTypes.API) {
            return {
                ...node,
                data: {
                    ...node.data,
                    selectedFields: undefined
                }
            };
        }

        return node;
    });
}

export { getImmediatePrecedingFormNodes, createNewNode, removeSelectedFieldsFromIsolatedApiNodes };
