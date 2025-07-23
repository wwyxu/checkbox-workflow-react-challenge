import { LOCAL_STORAGE_KEY } from "@/constants";

const createWorkFlowSave = (nodes, edges) => {
    const workflowConfig = {
        nodes: nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
        })),
        edges: edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
        })),
        metadata: {
            name: 'Sample Workflow',
            version: '1.0.0',
            created: new Date().toISOString(),
        },
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workflowConfig));workflowConfig
}

const getInitialData = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);

      if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        return {
          initialNodes: parsed.nodes,
          initialEdges: parsed.edges,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load workflow from localStorage:', e);
  }

  return {
    initialNodes: [],
    initialEdges: [],
  };
};

export { createWorkFlowSave, getInitialData };
