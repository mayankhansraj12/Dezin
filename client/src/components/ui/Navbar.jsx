import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const Navbar = ({ className, title = "App", links = [], ...props }) => {
    return (
        <div className={cn("border-b bg-white", className)} {...props}>
            <div className="flex h-16 items-center px-4">
                <div className="text-lg font-semibold text-slate-900 mr-8">
                    {title}
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    {links.map((link, index) => (
                        <Button key={index} variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
                            {link.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

Navbar.displayName = 'Navbar';

export { Navbar };
