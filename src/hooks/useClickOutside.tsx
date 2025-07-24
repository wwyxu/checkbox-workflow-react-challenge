import { useEffect, useRef } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside<T extends HTMLElement>(handler: Handler) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // Check if the click is on a Radix UI portal element
      const target = event.target as Element;
      
      // Modal would close when clicking select field
      const radixPortalSelectors = [
        '[data-radix-portal]',
        '[data-radix-popper-content-wrapper]',
        '.radix-select-content',
        '.radix-dropdown-menu-content',
        '.radix-popover-content',
        '.radix-tooltip-content',
        '[role="listbox"]',
        '[role="option"]',
      ];

      // Check if the clicked element or any parent is a Radix portal
      const isRadixPortal = radixPortalSelectors.some(selector => 
        target.closest(selector) !== null
      );

      if (isRadixPortal) {
        return;
      }

      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}