import React from 'react';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';

const Layout = () => {
    return (
        <div className="flex h-screen w-screen bg-background overflow-hidden font-sans">
            {/* Left Panel: Chat & Controls */}
            <div className="w-[450px] h-full flex-shrink-0 border-r border-border bg-card relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <ChatPanel />
            </div>

            {/* Right Panel: Preview Area */}
            <div className="flex-1 h-full overflow-hidden bg-zinc-950 relative">
                {/* Dotted Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.2]"
                    style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>
                <div className="relative z-10 h-full">
                    <PreviewPanel />
                </div>
            </div>
        </div>
    );
};

export default Layout;
