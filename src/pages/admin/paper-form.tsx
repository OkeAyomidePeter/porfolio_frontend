import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, FileText, ImageIcon } from "lucide-react";
import { createPaper, getPaper, updatePaper } from "@/lib/data-utils";

type PaperFormState = {
  title: string;
  abstract: string;
  content: string;
  date: string;
  authorsInput: string;
  tagsInput: string;
};

const defaultState: PaperFormState = {
  title: "",
  abstract: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  authorsInput: "Ayomide Oke",
  tagsInput: "",
};

export function PaperForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== "new");

  const [formState, setFormState] = useState<PaperFormState>(defaultState);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );
  const [existingPdf, setExistingPdf] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing || !id || id === "new") {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const paper = await getPaper(Number(id));
        if (!isMounted) return;
        setFormState({
          title: paper.title,
          abstract: paper.abstract,
          content: paper.content,
          date: paper.date,
          authorsInput: paper.authors.join(", "),
          tagsInput: paper.tags.join(", "),
        });
        setExistingThumbnail(paper.thumbnail_path ?? null);
        setExistingPdf(paper.pdf_path ?? null);
      } catch (error) {
        console.error("Unable to load research paper", error);
        if (isMounted) setError("Unable to load research paper");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPaper();
    return () => {
      isMounted = false;
    };
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const authorsArray = formState.authorsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArray = formState.tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("abstract", formState.abstract);
    formData.append("content", formState.content);
    formData.append("date", formState.date);
    formData.append("authors", JSON.stringify(authorsArray));
    formData.append("tags", JSON.stringify(tagsArray));

    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    if (pdfFile) formData.append("pdf", pdfFile);

    try {
      if (isEditing && id) {
        await updatePaper(Number(id), formData);
      } else {
        await createPaper(formData);
      }
      navigate("/admin/papers");
    } catch (error) {
      console.error("Failed to save research paper", error);
      setError("Failed to save research paper. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/papers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Paper" : "New research paper"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update publication details"
              : "Publish a new research paper"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paper Details</CardTitle>
          <CardDescription>
            Enter the metadata and content for your publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground">Loading paper...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract *</Label>
                <Textarea
                  id="abstract"
                  name="abstract"
                  value={formState.abstract}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Full Content/Article (Markdown) *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  rows={12}
                  required
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="authorsInput">
                    Authors (comma-separated) *
                  </Label>
                  <Input
                    id="authorsInput"
                    name="authorsInput"
                    value={formState.authorsInput}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Publication Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formState.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagsInput">Tags (comma-separated)</Label>
                <Input
                  id="tagsInput"
                  name="tagsInput"
                  value={formState.tagsInput}
                  onChange={handleChange}
                  placeholder="e.g., AI, Computer Vision, MQTT"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-lg border">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <ImageIcon className="h-4 w-4" /> Thumbnail Upload
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] ?? null)
                    }
                  />
                  {existingThumbnail && !thumbnailFile && (
                    <div className="text-xs text-muted-foreground">
                      Current: {existingThumbnail.split("/").pop()}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <FileText className="h-4 w-4" /> PDF Upload
                  </div>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                  />
                  {existingPdf && !pdfFile && (
                    <div className="text-xs text-muted-foreground">
                      Current: {existingPdf.split("/").pop()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Paper"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/papers")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
