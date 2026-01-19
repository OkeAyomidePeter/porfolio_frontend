import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Download, FileText, ChevronLeft } from "lucide-react";
import {
  buildAssetUrl,
  getPaper,
  type ResearchPaper as PaperType,
} from "@/lib/data-utils";
import { Markdown } from "@/components/markdown";

export function PaperDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<PaperType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPaper = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getPaper(Number(id));
        if (isMounted) {
          setPaper(data);
        }
      } catch (error) {
        console.error("Failed to load research paper", error);
        if (isMounted) {
          setError("Paper not found");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPaper();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading research paper...</p>
      </div>
    );
  }

  if (!paper || error) {
    return (
      <div className="container px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Paper not found</h1>
        <Button onClick={() => navigate("/papers")}>Back to Research</Button>
      </div>
    );
  }

  const formattedDate = new Date(paper.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/papers")}
        className="mb-8 p-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Research
      </Button>

      <article className="space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(paper.tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {paper.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-semibold text-foreground">Authors:</span>
              </div>
              <span>{(paper.authors ?? []).join(", ")}</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold text-foreground">Date:</span>
              </div>
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border">
            <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
              <FileText className="h-4 w-4" />
              Abstract
            </div>
            <p className="text-muted-foreground italic leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          {paper.pdf_path && (
            <div className="flex items-center gap-4">
              <Button asChild className="rounded-full px-6">
                <a
                  href={buildAssetUrl(paper.pdf_path) ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          )}
        </header>

        {paper.thumbnail_path && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border">
            <img
              src={buildAssetUrl(paper.thumbnail_path) ?? ""}
              alt={paper.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <Markdown content={paper.content} />
        </div>
      </article>
    </div>
  );
}
