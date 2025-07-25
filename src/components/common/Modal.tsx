import { useClickOutside } from '@/hooks/useClickOutside';
import { AlertDialog } from '@radix-ui/themes';
import React from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  maxWidth?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  maxWidth = '450px',
  children,
}) => {
  const ref = useClickOutside<HTMLDivElement>(() => {
    if (open) onOpenChange(false);
  });

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content style={{ maxWidth }} ref={ref}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        {children}
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default Modal;
