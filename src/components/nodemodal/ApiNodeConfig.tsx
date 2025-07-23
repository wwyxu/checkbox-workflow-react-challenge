import { HttpTypes } from '@/constants';
import { Models } from '@/models';
import { getImmediatePrecedingFormNodes } from '@/utils';
import { validateApiNodeConfig } from '@/validation/forms/ApiNodeConfig';
import { AlertCircle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { ModalFooter } from './common/ModalFooter';
import {
  Box,
  Flex,
  Grid,
  Text,
  TextField,
  Select,
  Checkbox,
  Button,
  Separator,
  Theme
} from '@radix-ui/themes';
import { ErrorAlert } from './common/ErrorAlert';

const APINodeConfig = ({ node, onSave, nodes, edges, onClose }) => {
  const [nodeName, setNodeName] = useState<string>(node?.data?.label || '');
  const [httpMethod, setHttpMethod] = useState<HttpTypes.POST | HttpTypes.PUT>(node?.data?.method || HttpTypes.POST);
  const [url, setUrl] = useState<string>(node?.data?.endpoint || '');
  const [selectedFields, setSelectedFields] = useState<string[]>(node?.data?.selectedFields || []);
  const [errors, setErrors] = useState<Models.ValidationErrors>({});

  const availableFields = useMemo<Models.FormField[]>(() => {
    const precedingFormNodes = getImmediatePrecedingFormNodes(node.id, nodes, edges);
    return precedingFormNodes || [];
  }, [nodes, edges, node.id]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Models.ValidationErrors = validateApiNodeConfig(nodeName, httpMethod, url);
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
          <Text as="label" size="2" weight="medium" mb="1" htmlFor="nodeName">
            Node Name
          </Text>
          <TextField.Root
            id="nodeName"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter node name"
          />
          {errors.nodeName && (
            <ErrorAlert>{errors.nodeName}</ErrorAlert>
          )}
        </Box>

        {/* HTTP Method & URL */}
        <Grid columns={{ initial: "1", md: "2" }} gap="2" mb="4">
          <Box>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium" htmlFor="httpMethod">
                HTTP Method
              </Text>
              <Select.Root
                value={httpMethod}
                onValueChange={(v) => setHttpMethod(v as HttpTypes.POST | HttpTypes.PUT)}
              >
                <Select.Trigger id="httpMethod" />
                <Select.Content>
                  <Select.Item value={HttpTypes.POST}>POST</Select.Item>
                  <Select.Item value={HttpTypes.PUT}>PUT</Select.Item>
                </Select.Content>
              </Select.Root>
              {errors.httpMethod && (
                <ErrorAlert>{errors.httpMethod}</ErrorAlert>
              )}
            </Flex>
          </Box>
          <Box>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium" htmlFor="url">
                URL
              </Text>
              <TextField.Root
                id="url"
                value={url}
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
              {errors.url && (
                <ErrorAlert>{errors.url}</ErrorAlert>
              )}
            </Flex>
          </Box>
        </Grid>

        {/* Request Body Fields */}
        <Box mb="4">
          <Text as="label" size="2" weight="medium" mb="2">
            Request Body Fields
          </Text>
          {availableFields.length === 0 ? (
            <Box p="3" style={{ background: "var(--gray-a2)" }}>
              <Flex direction="column" align="center" py="6">
                <AlertCircle size={24} color="var(--gray-a6)" />
                <Text color="gray" mt="2" size="2">
                  No form fields available. Add Form nodes to the nodes first.
                </Text>
              </Flex>
            </Box>
          ) : (
            <Flex direction="column" gap="2">
              {availableFields.map(field => (
                <Box key={field.id} p="4" style={{ background: "var(--gray-a2)" }}>
                  <Flex
                    key={`${field.nodeId}-${field.id}`}
                    align="center"
                    gap="3"
                    p="2"
                    m="2"
                    asChild
                  >
                    <label
                      htmlFor={`field-${field.id}`}
                      style={{ width: "100%", display: "flex", alignItems: "center" }}
                    >
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => handleFieldToggle(field.id)}
                        mr="3"
                      />
                      <Box>
                        <Flex align="center" gap="2" wrap="wrap">
                          <Text weight="medium">{field.name}</Text>
                          <Text size="1" color="blue" style={{ background: "var(--blue-a3)", borderRadius: '9999px', padding: '2px 8px' }}>
                            {field.type}
                          </Text>
                          {field.required && (
                            <Text size="1" color="red" style={{ background: "var(--red-a3)", borderRadius: '9999px', padding: '2px 8px' }}>
                              Required
                            </Text>
                          )}
                        </Flex>
                        <Text as="p" size="1" color="gray" mt="1">
                          From: {field.nodeName}
                        </Text>
                      </Box>
                    </label>
                  </Flex>
                </Box>
              ))}
            </Flex>
          )}
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