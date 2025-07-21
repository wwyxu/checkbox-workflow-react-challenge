
function validateWorkflowPath(nodes, edges) {
  const errors = [];
  // Find start and end nodes
  const startNodes = nodes.filter(node => node.type === 'start');
  const endNodes = nodes.filter(node => node.type === 'end');
  
  // Validation checks
  if (startNodes.length === 0) {
    errors.push('No start node found');
  }
  
  if (endNodes.length === 0) {
    errors.push('No end node found');
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
  
  // Perform DFS to check if end node is reachable from start node
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
    errors.push(`No complete path exists from start node ${startNode.id} to end node ${endNode.id}`);
  }
  
  return errors;
}

export { validateWorkflowPath };
