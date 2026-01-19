import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Users, FileText } from "lucide-react";
import {
  buildAssetUrl,
  deletePaper,
  getPapers,
  type ResearchPaper,
} from "@/lib/data-utils";

export function AdminPapers() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        const data = await getPapers();
        if (isMounted) {
          setPapers(data);
        }
      } catch (error) {
        console.error("Unable to load research papers", error);
        if (isMounted) {
          setError("Unable to load research papers");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPapers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this research paper?")) {
      return;
    }

    try {
      await deletePaper(id);
      setPapers((prev) => prev.filter((paper) => paper.id !== id));
    } catch (error) {
      console.error("Failed to delete research paper", error);
      alert("Failed to delete research paper. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
          <p className="text-muted-foreground">Manage your publication list</p>
        </div>
        <Button onClick={() => navigate("/admin/papers/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Paper
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Loading papers...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <Card key={paper.id} className="flex flex-col h-full">
              <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={
                    buildAssetUrl(paper.thumbnail_path) ??
                    "https://placehold.co/800x450?text=Research"
                  }
                  alt={paper.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">
                  {paper.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-4">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(paper.tags ?? []).slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {paper.pdf_path && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 flex items-center gap-1"
                    >
                      <FileText className="h-2 w-2" /> PDF
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-[10px] text-muted-foreground mt-auto">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(paper.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {(paper.authors ?? []).join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/papers/${paper.id}`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(paper.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
