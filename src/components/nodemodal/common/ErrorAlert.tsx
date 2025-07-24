import { Callout } from '@radix-ui/themes';
import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ children }: { children: React.ReactNode }) {
  return (
    <Callout.Root color="red" mt="2">
      <Callout.Icon>
        <AlertCircle size={16} />
      </Callout.Icon>
      <Callout.Text>{children}</Callout.Text>
    </Callout.Root>
  );
}
