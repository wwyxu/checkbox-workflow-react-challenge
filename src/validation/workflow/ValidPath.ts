import { moreThanOneInvalid } from "@/constants";

function validateWorkflowPath(nodes, edges) {
  const errors = [];
  // Find start and End Nodes
  const startNodes = nodes.filter(node => node.type === 'start');
  const endNodes = nodes.filter(node => node.type === 'end');

  // Validation checks
  if (startNodes.length === 0) {
    errors.push('No Start Node found');
  }

  if (endNodes.length === 0) {
    errors.push('No End Node found');
  }

  if (errors.length > 0) {
    return errors;
  }

  const startNode = startNodes[0];
  const endNode = endNodes[0];

  // Build adjacency list from edges
  const adjacencyList = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  edges.forEach(edge => {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  });

  // Perform DFS to check if End Node is reachable from Start Node
  function canReachEnd(currentNodeId, visited = new Set()) {
    if (currentNodeId === endNode.id) {
      return true;
    }

    if (visited.has(currentNodeId)) {
      return false; // Prevent infinite loops
    }

    visited.add(currentNodeId);

    const neighbors = adjacencyList[currentNodeId] || [];
    for (const neighbor of neighbors) {
      if (canReachEnd(neighbor, visited)) {
        return true;
      }
    }

    return false;
  }

  const hasCompletePath = canReachEnd(startNode.id);

  if (!hasCompletePath) {
    errors.push(`No complete path exists from Start Node ${startNode.id} to End Node ${endNode.id}`);
  }

  return errors;
}

const hasMoreThanOneInvalid = (nodes) => {
  let errors = [];

    if (nodes?.length > 0) {
      Object.entries(moreThanOneInvalid).forEach(([type, errorMsg]) => {
        if (nodes.filter(node => node.type === type).length > 1) {
          errors.push(errorMsg);
        }
      });
    }

    return errors
}

export { validateWorkflowPath, hasMoreThanOneInvalid };
