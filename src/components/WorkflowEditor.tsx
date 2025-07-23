import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Save } from 'lucide-react';

import { removeSelectedFieldsFromIsolatedApiNodes, validateForms, validateWorkflowPath } from '@/validation';

import { EVENT_DATA_TRANSFER_KEY, NodeTypes } from '@/constants';
import moreThanOneInvalid from '@/constants/errors';
import BlockPanel from './BlockPanel';
import Modal from './common/Modal';
import APINodeConfig from './formconfig/ApiNodeConfig';
import FormNodeConfig from './formconfig/FormNodeConfig';
import ApiNode from './nodes/ApiNode';
import ConditionalNode from './nodes/ConditionalNode';
import EndNode from './nodes/EndNode';
import FormNode from './nodes/FormNode';
import StartNode from './nodes/StartNode';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { getInitialData } from '@/utils';

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  conditional: ConditionalNode,
  api: ApiNode,
  end: EndNode,
};

const nodeColor = {
  [NodeTypes.START]: '#10b981',
  [NodeTypes.FORM]: '#3b82f6',
  [NodeTypes.CONDITIONAL]: '#f59e0b',
  [NodeTypes.API]: '#a855f7',
  [NodeTypes.END]: '#ef4444',
  default: '#6b7280'
};

const WorkflowEditorInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);
  const [workflowSaveErrors, setWorkflowSaveErrors] = useState<string[]>([]);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const { initialNodes, initialEdges } = getInitialData();
    setNodes(initialNodes || []);
    setEdges(initialEdges || []);
  }, [setNodes, setEdges]);

  useEffect(() => {
    const errors: string[] = [];

    if (nodes?.length > 0) {
      // Check there is more than one start and end node
      Object.entries(moreThanOneInvalid).forEach(([type, errorMsg]) => {
        if (nodes.filter(node => node.type === type).length > 1) {
          errors.push(errorMsg);
        }
      });
    }

    setWorkflowErrors(errors);
  }, [nodes]);

  useEffect(() => {
    if (nodes.length > 0) {
    const newNodes = removeSelectedFieldsFromIsolatedApiNodes(nodes, edges);
    console.log('Updated nodes after removing isolated API nodes:', newNodes);
    setNodes(newNodes);
    }
  }, [edges]);

  const nextNodeId = useMemo(
    () => nodes?.length ? Math.max(...nodes.map(n => Number(n.id))) + 1 : 0,
    [nodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNode(node);
    setShowNodeDialog(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(EVENT_DATA_TRANSFER_KEY);
      if (!type) return;

      // Get the position where the node was dropped
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      // Create a new node
      const newNode = {
        id: `${nextNodeId}`,
        type,
        position,
        data: {
          label: `${type} node`,
          ...(type === NodeTypes.FORM && { fields: [] }),
          ...(type === NodeTypes.CONDITIONAL && { conditions: [] }),
          ...(type === NodeTypes.API && { endpoint: '', method: 'GET' }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, nextNodeId, screenToFlowPosition, setNodes]
  );

  const handleSave = () => {
    const errors = [...validateForms(nodes), ...validateWorkflowPath(nodes, edges)];

    if (workflowErrors.length > 0 || errors.length > 0) {
      setWorkflowSaveErrors(errors);
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
  };

  const handleNodeDialogClose = useCallback(() => {
    setShowNodeDialog(false);
    setSelectedNode(null);
  }, []);

  const handleNodeSave = useCallback((node) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...node.data } } : n))
    );

    setShowNodeDialog(false);
  }, [nodes, setNodes]);

  const renderNodeConfig = useCallback(() => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case NodeTypes.API:
        return (
          <APINodeConfig
            node={selectedNode}
            nodes={nodes}
            edges={edges}
            onSave={handleNodeSave}
            onClose={handleNodeDialogClose}
          />
        );
      case NodeTypes.FORM:
        return (
          <FormNodeConfig
            node={selectedNode}
            onSave={handleNodeSave}
            onClose={handleNodeDialogClose}
          />
        );
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
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleNodeDialogClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        );
    }
  }, [selectedNode, nodes, handleNodeSave, handleNodeDialogClose]);

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
            {(workflowErrors.length > 0 || workflowSaveErrors.length > 0) && (
              <Box p="2" style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                <Text size="2" color="red">
                  Workflow Errors: {[...workflowErrors, ...workflowSaveErrors].join(', ')}
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
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                nodeColor={(node) => nodeColor[node.type] || nodeColor.default}
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