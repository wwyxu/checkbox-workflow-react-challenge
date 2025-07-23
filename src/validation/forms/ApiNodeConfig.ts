import { NodeTypes } from "@/constants";
import { Models } from "@/models";

const validateURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const validateApiNodeConfig = (nodeName, url) => {
    const newErrors: Models.ValidationErrors = {};

    if (!nodeName.trim()) {
        newErrors.nodeName = 'Node name is required';
    }

    if (!url.trim()) {
        newErrors.url = 'URL is required';
    } else if (!validateURL(url)) {
        newErrors.url = 'Please enter a valid URL';
    }

    return newErrors;
};

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

export { validateURL, validateApiNodeConfig, removeSelectedFieldsFromIsolatedApiNodes };
