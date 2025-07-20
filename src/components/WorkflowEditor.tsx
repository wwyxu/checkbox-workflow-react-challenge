import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Save } from 'lucide-react';

import StartNode from './nodes/StartNode';
import FormNode from './nodes/FormNode';
import ConditionalNode from './nodes/ConditionalNode';
import ApiNode from './nodes/ApiNode';
import EndNode from './nodes/EndNode';
import BlockPanel from './BlockPanel';
import moreThanOneInvalid from '@/constants/errors';
import Modal from './common/Modal';
import APINodeConfig from './formconfig/ApiNodeConfig';
import FormNodeConfig from './formconfig/FormNodeConfig';

const LOCAL_STORAGE_KEY = 'workflow-editor-config';

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  conditional: ConditionalNode,
  api: ApiNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const getInitialData = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);

      // Check for valid structure
      if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        return {
          nodes: parsed.nodes,
          edges: parsed.edges,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load workflow from localStorage:', e);
  }
  return {
    nodes: initialNodes,
    edges: initialEdges,
  };
};

const WorkflowEditorInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    // Load initial data from localStorage
    const initialData = getInitialData();
    setNodes(initialData.nodes);
    setEdges(initialData.edges);
  }, [setNodes, setEdges]); 

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNode(node);
    setShowNodeDialog(true);
  }, []);

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Get the position where the node was dropped
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let currentId = 0;

      if (nodes.length > 0) {
        currentId = Number(nodes[nodes.length - 1].id)
      }

      // Create a new node
      const newNode = {
        id: `${currentId + 1}`,
        type,
        position,
        data: {
          label: `${type} node`,
          ...(type === 'form' && { fields: [] }),
          ...(type === 'conditional' && { conditions: [] }),
          ...(type === 'api' && { endpoint: '', method: 'GET' }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, screenToFlowPosition, setNodes]
  );

  // Check for workflow errors
  useEffect(() => {
    const errors: string[] = [];

    Object.entries(moreThanOneInvalid).forEach(([type, errorMsg]) => {
      if (nodes.filter(node => node.type === type).length > 1) {
        errors.push(errorMsg);
      }
    });

    setWorkflowErrors(errors);
  }, [nodes]);

  // Save workflow to localStorage
  const handleSave = () => {
    if (workflowErrors.length > 0) {
      alert('Please fix the errors before saving.');
      return;
    }

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

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workflowConfig));
    setShowSaveDialog(true);

    // For debugging (optional): still log to console
    console.log('Workflow configuration saved:', workflowConfig);
  };

  const handleNodeDialogClose = () => {
    setShowNodeDialog(false);
    setSelectedNode(null);
  };

  const handleNodeSave = (node) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...node.data } } : n))
    );

    setShowNodeDialog(false);
  }

  const renderNodeConfig = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'api':
        return <APINodeConfig node={selectedNode} workflow={nodes} onSave={handleNodeSave} />;

      case 'form':
        return <FormNodeConfig node={selectedNode} onSave={handleNodeSave} />;

      default:
        return (
          <div>
            <Text size="2" weight="bold">Node ID:</Text>
            <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>{selectedNode.id}</Text>

            <Text size="2" weight="bold">Type:</Text>
            <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>{selectedNode.type}</Text>

            <Text size="2" weight="bold">Position:</Text>
            <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>
              x: {Math.round(selectedNode.position.x)}, y: {Math.round(selectedNode.position.y)}
            </Text>

            <Text size="2" weight="bold">Data:</Text>
            <pre style={{
              background: '#f8fafc',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(selectedNode.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Flex minHeight="100vh" direction="column" style={{ width: '100%' }}>
      <Card m="4" mb="0">
        <Flex flexGrow="1" justify="between" align="center">
          <Heading as="h2">Workflow Editor</Heading>

          <Button onClick={handleSave}>
            <Save size={16} />
            Save Workflow
          </Button>
        </Flex>
      </Card>

      {/* Main Content with Panel and Canvas */}
      <Flex flexGrow="1" m="4" mt="2" gap="4">
        {/* Left Panel */}
        <BlockPanel />

        {/* Workflow Canvas */}
        <Box flexGrow="1" style={{ minHeight: '600px' }}>
          <Card style={{ overflow: 'hidden', height: '100%' }}>
            {workflowErrors.length > 0 && (
              <Box p="2" style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                <Text size="2" color="red">
                  Workflow Errors: {workflowErrors.join(', ')}
                </Text>
              </Box>
            )}

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius)',
              }}
            >
              <Controls
                style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <MiniMap
                style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'start':
                      return '#10b981';
                    case 'form':
                      return '#3b82f6';
                    case 'conditional':
                      return '#f59e0b';
                    case 'api':
                      return '#a855f7';
                    case 'end':
                      return '#ef4444';
                    default:
                      return '#6b7280';
                  }
                }}
              />
              <Background color="#e2e8f0" gap={20} />
            </ReactFlow>

          </Card>
        </Box>
      </Flex>

      {/* Node Details Modal */}
      <Modal
        open={showNodeDialog}
        title={selectedNode ? `${selectedNode.type} Node Details` : 'Node Details'}
        onOpenChange={setShowNodeDialog}
        onClose={handleNodeDialogClose}
      >
        {renderNodeConfig()}
      </Modal>

      {/* Save Dialog Modal */}
      <Modal
        open={showSaveDialog}
        title="Workflow Saved"
        onOpenChange={setShowSaveDialog}
        onClose={() => setShowSaveDialog(false)}
      >
        <Text size="2">
          Your workflow configuration has been saved to your browser. You can close and reopen this page to continue editing.
        </Text>
      </Modal>
    </Flex>
  );
};

const WorkflowEditor = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner />
    </ReactFlowProvider>
  );
};

export default WorkflowEditor;