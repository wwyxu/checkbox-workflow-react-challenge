import { HttpTypes } from '@/constants';
import { Models, Validation } from '@/models';
import { getImmediatePrecedingFormNodes } from '@/utils';
import { validateApiNodeConfig } from '@/validation/forms/ApiNodeConfig';
import { Box, Grid, Theme } from '@radix-ui/themes';
import { useCallback, useMemo, useState } from 'react';
import { ModalFooter } from '../common/ModalFooter';
import { FormField } from './common/FormField';
import { FormSelect } from './common/FormSelect';
import { FieldSelector } from './common/FieldSelector';

const httpMethodOptions = [
    { value: HttpTypes.POST, label: 'POST' },
    { value: HttpTypes.PUT, label: 'PUT' }
];

const APINodeConfig = ({ node, onSave, nodes, edges, onClose }) => {
    const [nodeName, setNodeName] = useState<string>(node?.data?.label || '');
    const [httpMethod, setHttpMethod] = useState<HttpTypes.POST | HttpTypes.PUT>(node?.data?.method || HttpTypes.POST);
    const [url, setUrl] = useState<string>(node?.data?.endpoint || '');
    const [selectedFields, setSelectedFields] = useState<string[]>(node?.data?.selectedFields || []);
    const [errors, setErrors] = useState<Validation.ValidationErrors>({});

    const availableFields = useMemo<Models.FormField[]>(() => {
        const precedingFormNodes = getImmediatePrecedingFormNodes(node.id, nodes, edges);
        return precedingFormNodes || [];
    }, [nodes, edges, node.id]);

    const validateForm = useCallback((): boolean => {
        const newErrors: Validation.ValidationErrors = validateApiNodeConfig(nodeName, httpMethod, url);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [nodeName, url]);

    const handleFieldToggle = useCallback((fieldId: string) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    }, []);

    const handleSave = useCallback(() => {
        if (validateForm()) {
            onSave({
                ...node,
                data: {
                    ...node.data,
                    label: nodeName,
                    method: httpMethod,
                    endpoint: url,
                    selectedFields,
                },
            });
        }
    }, [validateForm, onSave, node, nodeName, httpMethod, url, selectedFields]);

    return (
        <Theme>
            <Box>
                {/* Node Name */}
                <Box mb="4">
                    <FormField
                        label="Node Name"
                        id="nodeName"
                        value={nodeName}
                        onChange={setNodeName}
                        placeholder="Enter node name"
                        error={errors.nodeName}
                        required
                    />
                </Box>

                {/* HTTP Method & URL */}
                <Grid columns={{ initial: "1", md: "2" }} gap="2" mb="4">
                    <FormSelect
                        label="HTTP Method"
                        id="httpMethod"
                        value={httpMethod}
                        onChange={(v) => setHttpMethod(v as HttpTypes.POST | HttpTypes.PUT)}
                        options={httpMethodOptions}
                        error={errors.httpMethod}
                        required
                    />

                    <FormField
                        label="URL"
                        id="url"
                        value={url}
                        onChange={setUrl}
                        type="url"
                        placeholder="https://api.example.com/endpoint"
                        error={errors.url}
                        required
                    />
                </Grid>

                {/* Request Body Fields */}
                <Box mb="4">
                    <FieldSelector
                        fields={availableFields}
                        selectedFields={selectedFields}
                        onFieldToggle={handleFieldToggle}
                        label="Request Body Fields"
                        emptyMessage="No form fields available. Add Form Nodes to the workflow first."
                    />
                </Box>

                <ModalFooter
                    onSave={handleSave}
                    onClose={onClose}
                />
            </Box>
        </Theme>
    );
};

export default APINodeConfig;