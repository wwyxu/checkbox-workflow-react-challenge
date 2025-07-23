import { LOCAL_STORAGE_KEY } from '@/constants/cache';

// const initialNodes: Node[] = [];
// const initialEdges: Edge[] = [];

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

export { getInitialData };
