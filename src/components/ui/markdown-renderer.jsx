import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({ content, className }) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "text-sm leading-relaxed text-foreground space-y-2",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1
              className="text-2xl font-bold mt-4 mb-2 break-words"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-xl font-bold mt-3 mb-2 break-words"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-lg font-semibold mt-2 mb-1 break-words"
              {...props}
            />
          ),
          p: (props) => (
            <p className="my-1 leading-relaxed break-words" {...props} />
          ),
          a: (props) => (
            <a
              className="text-primary hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          ul: (props) => (
            <ul className="list-disc ps-5 my-2 space-y-1" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal ps-5 my-2 space-y-1" {...props} />
          ),
          li: (props) => <li className="leading-relaxed" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-s-4 border-primary/50 ps-3 italic text-muted-foreground my-2"
              {...props}
            />
          ),
          // Inline code
          code: (props) => (
            <code
              className="font-mono text-xs rounded bg-muted px-1 py-0.5"
              {...props}
            />
          ),
          // Block code (strips the inline background/padding from the inner code tag)
          pre: (props) => (
            <pre
              className="rounded-lg bg-muted p-3 overflow-x-auto my-2 font-mono text-xs [&>code]:bg-transparent [&>code]:p-0"
              {...props}
            />
          ),
          hr: (props) => <hr className="my-4 border-border" {...props} />,
          img: (props) => (
            <img className="rounded-lg max-w-full my-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
