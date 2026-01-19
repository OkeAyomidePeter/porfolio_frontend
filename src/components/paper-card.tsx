import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { buildAssetUrl, type ResearchPaper } from "@/lib/data-utils";

export function PaperCard({
  id,
  title,
  abstract,
  date,
  authors,
  tags,
  thumbnail_path,
}: ResearchPaper) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-muted">
      <Link
        to={`/papers/${id}`}
        className="block relative aspect-video overflow-hidden"
      >
        <img
          src={
            buildAssetUrl(thumbnail_path) ??
            "https://placehold.co/800x450?text=Research+Paper"
          }
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </Link>
      <CardHeader className="p-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {(tags ?? []).slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-2 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Link to={`/papers/${id}`} className="block group">
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{abstract}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2 border-t mt-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span className="line-clamp-1">{(authors ?? []).join(", ")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
