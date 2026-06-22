// src/components/ui/markdown-renderer.jsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

// Recursively extract plain text from React children
function extractText(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props?.children) return extractText(node.props.children);
  return "";
}

function CodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = extractText(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // ✅ Inline code - small, inline with text
  if (inline || !match) {
    return (
      <code
        className="inline font-mono text-[0.85em] rounded bg-muted/80 dark:bg-muted/60 px-1.5 py-0.5 border border-border/50 text-foreground break-words"
        {...props}
      >
        {children}
      </code>
    );
  }

  // ✅ Block code - full width with syntax highlighting
  return (
    <div className="relative group/code my-3">
      {match && (
        <div className="absolute top-0 start-0 px-3 py-1 text-xs font-mono text-muted-foreground bg-muted/50 rounded-se-lg border-b border-e border-border">
          {match[1]}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 end-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover/code:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <pre
        className={cn(
          "rounded-lg bg-[#0d1117] p-4 pt-10 overflow-x-auto font-mono text-sm leading-relaxed",
          className,
        )}
        {...props}
      >
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert break-words",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-3",
        "prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-2",
        "prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2",
        "prose-p:leading-relaxed prose-p:my-2 prose-p:break-words",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:break-all",
        "prose-strong:font-semibold",
        "prose-blockquote:border-s-4 prose-blockquote:border-primary/50 prose-blockquote:ps-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        "prose-ul:my-2 prose-ul:space-y-1",
        "prose-ol:my-2 prose-ol:space-y-1",
        "prose-li:leading-relaxed prose-li:break-words",
        "prose-table:border-collapse prose-table:w-full",
        "prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2 prose-th:text-start prose-th:font-semibold",
        "prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:break-words",
        "prose-hr:my-6 prose-hr:border-border",
        "prose-img:rounded-lg prose-img:max-w-full prose-img:my-4",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          code: CodeBlock,
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
