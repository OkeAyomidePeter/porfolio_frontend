import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Twitter, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "./AnimatedContent";

import { buildAssetUrl } from "@/lib/data-utils";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  preview_image_path: string | null;
  tech_stack: string[];
  category: string[];
  github_link?: string | null;
  live_demo_link?: string | null;
  x_link?: string | null;
}

export function ProjectCard({
  id,
  title,
  description,
  preview_image_path,
  tech_stack,
  category,
  github_link,
  live_demo_link,
  x_link,
}: ProjectCardProps) {
  const previewUrl =
    buildAssetUrl(preview_image_path) ?? "https://placehold.co/800x600";
  const stack = Array.isArray(tech_stack) ? tech_stack : [];
  const categories = Array.isArray(category) ? category : [category];

  return (
    <AnimatedContent distance={30} duration={0.6}>
      <div className="glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 regal-shadow border border-amber-400/20">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={previewUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="glass-morphism bg-amber-50/20 border-amber-400/30 backdrop-blur-sm"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {stack.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs bg-amber-50/20 border-amber-400/30 hover:bg-amber-50/40 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {stack.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs bg-amber-50/20 border-amber-400/30"
              >
                +{stack.length - 4}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              size="sm"
              asChild
              className="w-full bg-gradient-to-r from-amber-600/20 to-amber-500/30 border border-amber-400/30 hover:from-amber-600/30 hover:to-amber-500/40"
            >
              <Link to={`/projects/${id}`} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Link>
            </Button>
            <div className="flex gap-2">
              {github_link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 glass-morphism border-amber-400/20 hover:border-amber-400/40"
                >
                  <a
                    href={github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                </Button>
              )}
              {live_demo_link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 glass-morphism border-amber-400/20 hover:border-amber-400/40"
                >
                  <a
                    href={live_demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                </Button>
              )}
              {x_link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="glass-morphism border-amber-400/20 hover:border-amber-400/40"
                >
                  <a
                    href={x_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter) link"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
