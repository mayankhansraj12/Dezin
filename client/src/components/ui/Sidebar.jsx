import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const Sidebar = ({ className, items = [], ...props }) => {
    return (
        <div className={cn("pb-12 w-64 border-r border-border min-h-screen bg-muted/40", className)} {...props}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {items.map((item, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
Sidebar.displayName = 'Sidebar';

export { Sidebar };
