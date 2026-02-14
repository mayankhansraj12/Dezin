import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, forwardedRef) => {
    const internalRef = React.useRef(null);
    const ref = forwardedRef || internalRef;

    // Auto-scroll to keep cursor visible when textarea grows
    React.useEffect(() => {
        const element = ref.current;
        if (element && type === 'textarea') {
            const scrollToBottom = () => {
                // Use setTimeout to ensure DOM has updated
                setTimeout(() => {
                    element.scrollTop = element.scrollHeight;
                }, 0);
            };

            const handleInput = () => {
                scrollToBottom();
            };

            const handleKeyDown = (e) => {
                // Scroll on Enter key press (for empty lines)
                if (e.key === 'Enter') {
                    scrollToBottom();
                }
            };

            element.addEventListener('input', handleInput);
            element.addEventListener('keydown', handleKeyDown);
            return () => {
                element.removeEventListener('input', handleInput);
                element.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [ref, type]);

    const Component = type === 'textarea' ? 'textarea' : 'input';

    return (
        <Component
            className={cn(
                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                type === 'textarea' && "resize-none overflow-auto max-h-[200px]",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export { Input };
