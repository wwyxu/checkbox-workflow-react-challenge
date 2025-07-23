import { Models } from "@/models";

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

export { getImmediatePrecedingFormNodes };
