import { Button, Flex, Separator } from '@radix-ui/themes';

interface ModalFooterProps {
  onClose: () => void;
  onSave?: () => void;
}

export function ModalFooter({ onClose, onSave }: ModalFooterProps) {
  return (
    <>
      <Separator my="2" size="4" />
      <Flex justify="end" gap="3" pt="2">
        {onSave && (
          <Button color="blue" onClick={onSave}>
            Save
          </Button>
        )}
        <Button color="gray" variant="soft" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </>
  );
}
