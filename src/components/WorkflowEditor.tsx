import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Save } from 'lucide-react';

import { createNewNode, createWorkFlowSave, getInitialData } from '@/utils';
import { hasMoreThanOneInvalid, validateForms, validateWorkflowPath } from '@/validation';
import { removeSelectedFieldsFromIsolatedApiNodes } from '@/utils';

import { EVENT_DATA_TRANSFER_KEY, ModalTypes, NodeTypes } from '@/constants';

import BlockPanel from './BlockPanel';
import Modal from './common/Modal';
import ApiNode from './nodes/ApiNode';
import ConditionalNode from './nodes/ConditionalNode';
import EndNode from './nodes/EndNode';
import FormNode from './nodes/FormNode';
import StartNode from './nodes/StartNode';
import WorkflowModal from './WorkflowModal';

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
  default: '#6b7280',
};

const WorkflowEditorInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);
  const [workflowSaveErrors, setWorkflowSaveErrors] = useState<string[]>([]);
  const [modalType, setModalType] = useState<ModalTypes>(ModalTypes.NONE);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const { initialNodes, initialEdges } = getInitialData();
    setNodes(initialNodes || []);
    setEdges(initialEdges || []);
  }, [setNodes, setEdges]);

  useEffect(() => {
    // Validate that there are no more than one start and End Node
    setWorkflowErrors(hasMoreThanOneInvalid(nodes));
  }, [nodes]);

  useEffect(() => {
    if (nodes.length > 0) {
      setNodes(removeSelectedFieldsFromIsolatedApiNodes(nodes, edges));
    }
  }, [edges]);

  const nextNodeId = useMemo(
    () => (nodes?.length ? Math.max(...nodes.map((n) => Number(n.id))) + 1 : 0),
    [nodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNode(node);
    setModalType(ModalTypes.NODE);
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
      const newNode = createNewNode(nextNodeId, type, position);
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

    setWorkflowSaveErrors([]);
    createWorkFlowSave(nodes, edges);
    setModalType(ModalTypes.SAVE);
  };

  const handleNodeDialogClose = useCallback(() => {
    setModalType(ModalTypes.NONE);
    setSelectedNode(null);
  }, []);

  const handleNodeSave = useCallback(
    (node) => {
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...node.data } } : n)));
      setModalType(ModalTypes.NONE);
    },
    [nodes, setNodes]
  );

  const modalOpen = modalType !== ModalTypes.NONE;
  const { modalTitle, modalContent } = WorkflowModal({
    modalType,
    selectedNode,
    nodes,
    edges,
    onClose: handleNodeDialogClose,
    onNodeSave: handleNodeSave,
    setModalType,
  });

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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                nodeColor={(node) => nodeColor[node.type] || nodeColor.default}
              />
              <Background color="#e2e8f0" gap={20} />
            </ReactFlow>
          </Card>
        </Box>
      </Flex>

      <Modal
        open={modalOpen}
        title={modalTitle}
        onOpenChange={(open) => {
          if (!open) {
            setModalType(ModalTypes.NONE);
            setSelectedNode(null);
          }
        }}
      >
        {modalContent}
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
