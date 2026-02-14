import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as UIComponents from './ui';
import * as LucideIcons from 'lucide-react';
import { Loader2, Code, Eye, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const PreviewPanel = () => {
    const { currentCode, isLoading, undo, redo, currentVersionIndex, versionHistory } = useStore();
    const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'code'

    // Transform code for react-live
    const transformCode = (inputCode) => {
        if (!inputCode) return "";
        let code = inputCode
            // Remove imports (support multiline)
            .replace(/import[\s\S]*?from\s+['"].*?['"];?/g, '')
            .replace(/import\s+['"].*?['"];?/g, '') // Side-effect imports
            // Remove export default
            .replace(/export\s+default\s+function\s+(\w+)/, 'const $1 = function')
            .replace(/export\s+default\s+(\w+)/, '');

        // SCOPE CONFLICT FIX:
        // If the code defines a component that is ALREADY in the scope (like Sidebar),
        // we must rename the internal one to avoid "Identifier 'Sidebar' has already been declared".
        // However, it's safer to just rely on the 'scope' for these components.
        // But if the AI *re-implements* Sidebar, we have a problem.
        // For now, we trust the Generator prompt fix (Step 853) to avoid redeclaration.

        // Extract component name
        const componentMatch = inputCode.match(/function\s+(\w+)/);
        const componentName = componentMatch ? componentMatch[1] : 'GeneratedUI';

        return `${code}\nrender(<${componentName} />)`;
    };

    const code = currentCode ? transformCode(currentCode) : `
render(
  <div className="p-10 text-center text-slate-500">
    <h2 className="text-xl font-semibold mb-2">Welcome to Dezin</h2>
    <p>Use the chat on the left to generate UI.</p>
  </div>
)`;

    // Scope for render
    const scope = {
        React,
        ...UIComponents,
        ...LucideIcons,
        // Aliases for common hallucinations or legacy names
        LightningBoltIcon: LucideIcons.Zap,
        LightningBolt: LucideIcons.Zap,
        DesktopComputer: LucideIcons.Monitor,
        ComputerDesktop: LucideIcons.Monitor,
        DeviceLaptop: LucideIcons.Laptop,
        SearchIcon: LucideIcons.Search,
        UserIcon: LucideIcons.User,
        HomeIcon: LucideIcons.Home,
        MenuIcon: LucideIcons.Menu,
        CloseIcon: LucideIcons.X,
        CheckIcon: LucideIcons.Check,
        PlusIcon: LucideIcons.Plus,
        MinusIcon: LucideIcons.Minus
    };

    return (

        <div className="flex flex-col h-full relative group bg-[#0d1117]">
            {/* Floating Toolbar with Higher Contrast */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-700 shadow-xl rounded-full transition-opacity opacity-0 group-hover:opacity-100">
                <div className="flex bg-zinc-800 rounded-full p-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "h-7 px-3 rounded-full text-xs font-medium transition-all",
                            activeTab === 'preview' ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-100"
                        )}
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "h-7 px-3 rounded-full text-xs font-medium transition-all",
                            activeTab === 'code' ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-100"
                        )}
                    >
                        <Code className="mr-1.5 h-3.5 w-3.5" /> Code
                    </Button>
                </div>
                <div className="w-px h-4 bg-zinc-700 mx-1"></div>
                <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" onClick={undo} disabled={currentVersionIndex <= 0} className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={redo} disabled={currentVersionIndex >= versionHistory.length - 1} className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                        <RotateCw className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-[#0d1117]">
                <LiveProvider code={code} scope={scope} noInline={true}>
                    {activeTab === 'preview' && (
                        <div className="h-full w-full overflow-auto flex items-center justify-center p-8">
                            <div className="w-full h-full bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl overflow-hidden relative ring-1 ring-zinc-800/50">
                                <div className="absolute top-3 left-4 flex gap-1.5 z-50">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600"></div>
                                </div>
                                <div className="h-full w-full overflow-auto bg-zinc-900/50">
                                    <LivePreview />
                                </div>
                            </div>
                            <LiveError className="absolute bottom-4 right-4 max-w-sm text-xs text-red-500 p-3 bg-red-50/90 backdrop-blur border border-red-200 rounded-lg shadow-lg" />
                        </div>
                    )}
                    {activeTab === 'code' && (
                        <div className="h-full w-full flex flex-col bg-[#0d1117] p-8">
                            {/* Floating Language Badge */}
                            <div className="absolute top-4 right-4 z-50 px-3 py-1 bg-zinc-900/90 border border-zinc-700 shadow-lg rounded-full backdrop-blur-sm">
                                <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">JSX / React</span>
                            </div>
                            <div className="flex-1 overflow-auto p-6 code-editor-scroll">
                                <LiveEditor
                                    style={{
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: 13
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </LiveProvider>
            </div>

            {/* Status Indicator */}
            <div className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest pointer-events-none">
                {isLoading ? "Generating..." : "Ready"}
            </div>
        </div>
    );
};

export default PreviewPanel;
