
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "./AnimatedContent";

import { buildAssetUrl } from "@/lib/data-utils";

interface BlogPostCardProps {
  id: number;
  title: string;
  excerpt: string;
  thumbnail_path: string | null;
  date: string;
  tags: string[];
  read_time: string;
}

export function BlogPostCard({
  id,
  title,
  excerpt,
  thumbnail_path,
  date,
  tags,
  read_time,
}: BlogPostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const thumbnailUrl =
    buildAssetUrl(thumbnail_path) ?? "https://placehold.co/800x600";
  const normalizedTags = Array.isArray(tags) ? tags : [];

  return (
    <AnimatedContent distance={30} duration={0.6}>
      <div className="glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 regal-shadow border border-amber-400/20">
        <Link to={`/blog/${id}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mb-4">{excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {normalizedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-amber-50/20 border-amber-400/30 hover:bg-amber-50/40 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{read_time}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </AnimatedContent>
  );
}
