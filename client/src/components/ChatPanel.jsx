import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatPanel = () => {
    const { messages, addMessage, isLoading, setLoading, setCode } = useStore();
    const [input, setInput] = useState('');
    // Default to 2.0 Flash for stability (1.5K RPD vs 20 RPD on 2.5)
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');
        addMessage('user', userMessage);
        setLoading(true);

        // Real API call
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }],
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (data.error) {
                if (data.error.includes("RATE_LIMIT")) {
                    // Extract retry time if available (format: RATE_LIMIT:model:1m 30s or RATE_LIMIT:model)
                    const parts = data.error.split(':');
                    const modelName = parts[1] || selectedModel;
                    const retryTime = parts[2];

                    let message = `⚠️ **Limit Reached for ${modelName}**\n`;
                    if (retryTime) {
                        message += `You can retry in **${retryTime}**.\n\n`;
                    }
                    message += `Try switching to a different model using the dropdown below.`;

                    addMessage('assistant', message);
                } else if (data.error.includes("MODEL_OVERLOAD")) {
                    addMessage('assistant', `⚠️ **${selectedModel} is Overloaded**\nGoogle's servers are currently busy. Please try again in a moment or switch to a different model.`);
                } else {
                    addMessage('assistant', data.error);
                }
            } else {
                addMessage('assistant', data.message);
                if (data.code) {
                    setCode(data.code);
                }
            }
        } catch (error) {
            addMessage('assistant', "Sorry, I couldn't reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                    <h1 className="font-semibold text-sm tracking-tight">Dezin AI</h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Make Smooth UI Easily</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-history-scroll" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                            <Send className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">What shall we build?</p>
                            <p className="text-xs text-muted-foreground">Describe your UI component or page.</p>
                        </div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={cn("max-w-[85%]", msg.role === 'user' ? "" : "")}>
                            {msg.role === 'user' ? (
                                <div className="bg-[#ffffff] text-black px-4 py-2.5 rounded-[20px] rounded-br-sm shadow-sm font-medium text-sm break-all">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm p-4 shadow-sm text-zinc-200 font-normal break-all",
                                    // Make error messages smaller
                                    msg.content.includes("**Your selected model failed:**") ||
                                        msg.content.includes("**Limit Reached") ||
                                        msg.content.includes("Overloaded")
                                        ? "text-[10px] opacity-70 italic"
                                        : "text-sm"
                                )}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline ? (
                                                    <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#09090b]">
                                                        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/50 border-b border-zinc-800">
                                                            <span className="text-[10px] uppercase font-medium text-zinc-500">Code</span>
                                                        </div>
                                                        <div className="p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
                                                            {children}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <code className={cn("bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 font-mono text-[11px] border border-zinc-700", className)} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-6" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-zinc-300" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-blue-400 hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex w-full justify-start">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm p-4 shadow-sm w-[60%] space-y-2">
                            <div className="h-4 bg-zinc-800 rounded w-1/4 animate-pulse"></div>
                            <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area - Opaque and distinct */}
            <div className="p-5 border-t border-zinc-800 bg-[#09090b] space-y-4">
                {/* Model Selector - Enhanced */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Model</span>
                        <div className="relative flex-1 max-w-[280px]">
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-zinc-900 text-sm font-semibold text-zinc-100 border border-zinc-700 hover:border-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/20 rounded-lg px-3 py-2 pr-10 cursor-pointer transition-all duration-200 appearance-none outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                                <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                    <div className="relative flex items-end gap-2 bg-zinc-800 border-2 border-zinc-700 focus-within:border-zinc-500 focus-within:bg-zinc-800/80 rounded-xl transition-all shadow-sm">
                        <Input
                            type="textarea"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                // Enter without Shift: Send message
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                                // Shift+Enter: Allow default (new line)
                            }}
                            placeholder="Describe your UI..."
                            disabled={isLoading}
                            className="flex-1 min-h-[56px] max-h-[200px] py-4 pl-4 pr-2 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 resize-none text-zinc-100 placeholder:text-zinc-500 font-medium shadow-none chat-input-scroll rounded-xl cursor-text"
                        />
                        <div className="pb-4 pr-4">
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading}
                                className={cn(
                                    "h-8 w-8 transition-all rounded-lg shrink-0",
                                    input.trim() ? "bg-white text-black hover:bg-zinc-200 opacity-100 scale-100" : "bg-zinc-700 text-zinc-500 opacity-50 scale-90"
                                )}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </form>
                <div className="text-[10px] text-center text-zinc-600 flex justify-center gap-4 font-medium">
                    <span><b>Enter</b> to send</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
