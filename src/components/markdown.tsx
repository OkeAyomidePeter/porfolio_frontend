import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:leading-relaxed prose-p:text-muted-foreground",
        "prose-li:text-muted-foreground",
        "prose-strong:text-foreground prose-strong:font-bold",
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded",
        "prose-pre:bg-muted/50 prose-pre:border prose-pre:rounded-lg",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
