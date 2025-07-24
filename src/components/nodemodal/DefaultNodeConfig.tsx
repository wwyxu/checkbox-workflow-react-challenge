import { ModalFooter } from "./common/ModalFooter";
import { Text } from "@radix-ui/themes";

const NodeDetails = ({ node, onClose }) => {
    const fields = [
        { label: "Node ID", value: node.id },
        { label: "Type", value: node.type },
        {
            label: "Position",
            value: `x: ${Math.round(node.position.x)}, y: ${Math.round(node.position.y)}`
        }
    ];

    return (
        <>
            {fields.map(({ label, value }) => (
                <div key={label}>
                    <Text size="2" weight="bold">{label}:</Text>
                    <Text size="2" style={{ display: 'block', marginBottom: '8px' }}>
                        {value}
                    </Text>
                </div>
            ))}
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
            <ModalFooter onClose={onClose} />
        </>
    );
};

export default NodeDetails;
