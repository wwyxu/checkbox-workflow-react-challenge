import { ModalFooter } from "./common/ModalFooter";
import { Text } from "@radix-ui/themes";

const NodeDetails = ({ node, onClose }) => (
    <div>
        <Text size="2" weight="bold">Node ID:</Text>
        <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>{node.id}</Text>
        <Text size="2" weight="bold">Type:</Text>
        <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>{node.type}</Text>
        <Text size="2" weight="bold">Position:</Text>
        <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>
            x: {Math.round(node.position.x)}, y: {Math.round(node.position.y)}
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
            {JSON.stringify(node.data, null, 2)}
        </pre>
        <ModalFooter
            onClose={onClose}
        />
    </div>
);

export default NodeDetails;