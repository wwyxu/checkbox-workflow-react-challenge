import React, { Children } from 'react';
import { AlertDialog, Flex, Button } from '@radix-ui/themes';

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    maxWidth?: string;
    onClose?: () => void;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    open,
    onOpenChange,
    title,
    maxWidth = '450px',
    onClose,
    children,
}) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content style={{ maxWidth }}>
                <AlertDialog.Title>{title}</AlertDialog.Title>
                {children}
                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button
                            variant="soft"
                            color="gray"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default Modal;