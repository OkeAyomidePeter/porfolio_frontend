import { useState, useEffect } from "react";
import { PaperCard } from "@/components/paper-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getPapers, type ResearchPaper as PaperType } from "@/lib/data-utils";

export function Papers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [papersData, setPapersData] = useState<PaperType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        const data = await getPapers();
        if (isMounted) {
          setPapersData(data);
        }
      } catch (error) {
        console.error("Failed to load research papers", error);
        if (isMounted) {
          setError("Failed to load research papers");
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

  const allTags = Array.from(
    new Set(
      papersData.flatMap((paper) =>
        Array.isArray(paper.tags) ? paper.tags : [],
      ),
    ),
  ).sort();

  const filteredPapers = papersData.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(paper.authors) ? paper.authors : []).some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      (Array.isArray(paper.tags) ? paper.tags : []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesTag =
      selectedTag === null ||
      (Array.isArray(paper.tags) && paper.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="container px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Research Papers</h1>
        <p className="text-lg text-muted-foreground">
          A collection of my research publications, preprints, and academic
          writings.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search papers by title, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            All Areas
          </Badge>
          {allTags.map((tag: string) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading research papers...</p>
        </div>
      ) : filteredPapers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} {...paper} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No papers found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
