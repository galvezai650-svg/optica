'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose-message", className)}>
      <ReactMarkdown
        components={{
          // Custom heading components
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-4 mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-3 mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-2 mb-1 text-purple-300">
              {children}
            </h3>
          ),
          // Custom list components
          ul: ({ children }) => (
            <ul className="list-none space-y-1 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none space-y-1 my-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full text-cyan-400">
                •
              </span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          // Custom paragraph
          p: ({ children }) => (
            <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
          ),
          // Custom code
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code className="bg-secondary/50 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("block font-mono text-sm", codeClassName)} {...props}>
                {children}
              </code>
            );
          },
          // Custom pre
          pre: ({ children }) => (
            <pre className="bg-secondary/80 border border-purple-500/20 rounded-xl p-4 overflow-x-auto my-3">
              {children}
            </pre>
          ),
          // Custom blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 bg-secondary/30 py-2 px-4 rounded-r-lg my-3 italic">
              {children}
            </blockquote>
          ),
          // Custom hr
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4" />
          ),
          // Custom strong
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          // Custom emphasis
          em: ({ children }) => (
            <em className="italic text-purple-300">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
