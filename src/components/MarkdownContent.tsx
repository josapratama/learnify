"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = !!match;
          return isBlock ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match![1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-100 dark:bg-gray-700 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-[0.875em] font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50 dark:bg-blue-950/30 py-2 pr-4 rounded text-gray-700 dark:text-gray-300 border dark:border-blue-900">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left font-bold text-gray-900 dark:text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-700 dark:text-gray-300">
            {children}
          </td>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
