import { Models } from '@/models';
import { Box, Checkbox, Flex, Text } from '@radix-ui/themes';

interface FieldCheckboxItemProps {
  field: Models.FormField;
  isSelected: boolean;
  onToggle: () => void;
}

export const FieldCheckboxItem = ({ field, isSelected, onToggle }: FieldCheckboxItemProps) => (
  <Box p="4" style={{ background: "var(--gray-a2)", cursor: "pointer" }}>
    <Flex
      align="center"
      gap="3"
      p="2"
      m="2"
      asChild
      style={{ cursor: "pointer" }}
    >
      <label
        htmlFor={`field-${field.id}`}
        style={{ width: "100%", display: "flex", alignItems: "center" }}
      >
        <Checkbox
          id={`field-${field.id}`}
          checked={isSelected}
          onCheckedChange={onToggle}
          mr="3"
        />
        <Box>
          <Flex align="center" gap="2" wrap="wrap">
            <Text weight="medium">{field.name}</Text>
            <Text size="1" color="blue" style={{ background: "var(--blue-a3)", borderRadius: '9999px', padding: '2px 8px' }}>
              {field.type}
            </Text>
            {field.required && (
              <Text size="1" color="red" style={{
                background: "var(--red-a3)",
                borderRadius: '9999px',
                padding: '2px 8px'
              }}>
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
);
