import React from 'react';
import { Text } from '@radix-ui/themes';
import { ModalFooter } from './common/ModalFooter';
import APINodeConfig from './nodeconfig/ApiNodeConfig';
import FormNodeConfig from './nodeconfig/FormNodeConfig';
import NodeDetails from './nodeconfig/DefaultNodeConfig';
import { ModalTypes, NodeTypes } from '@/constants';

const WorkflowModal = ({
  modalType,
  selectedNode,
  nodes,
  edges,
  onClose,
  onNodeSave,
  setModalType,
}) => {
  let modalTitle = '';
  let modalContent: React.ReactNode = null;

  if (modalType === ModalTypes.NODE && selectedNode) {
    modalTitle = `${selectedNode?.data?.label} Details`;
    if (selectedNode.type === NodeTypes.API) {
      modalContent = (
        <APINodeConfig
          node={selectedNode}
          nodes={nodes}
          edges={edges}
          onSave={onNodeSave}
          onClose={onClose}
        />
      );
    } else if (selectedNode.type === NodeTypes.FORM) {
      modalContent = <FormNodeConfig node={selectedNode} onSave={onNodeSave} onClose={onClose} />;
    } else {
      modalContent = <NodeDetails node={selectedNode} onClose={onClose} />;
    }
  } else if (modalType === ModalTypes.SAVE) {
    modalTitle = 'Workflow Saved';
    modalContent = (
      <>
        <Text size="2">
          Your workflow configuration has been saved to your browser. You can close and reopen this
          page to continue editing.
        </Text>
        <ModalFooter onClose={() => setModalType(ModalTypes.NONE)} />
      </>
    );
  }

  return { modalTitle, modalContent };
};

export default WorkflowModal;
