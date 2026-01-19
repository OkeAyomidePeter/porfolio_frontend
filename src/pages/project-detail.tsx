import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, ExternalLink, Twitter, ChevronLeft } from "lucide-react";
import {
  buildAssetUrl,
  getProject,
  type Project as ProjectType,
} from "@/lib/data-utils";
import { Markdown } from "@/components/markdown";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getProject(Number(id));
        if (isMounted) {
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to load project", error);
        if (isMounted) {
          setError("Project not found");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="container px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/projects")}
        className="mb-8 p-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Projects
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </header>

          {project.preview_image_path && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border shadow-sm">
              <img
                src={buildAssetUrl(project.preview_image_path) ?? ""}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About the project</h2>
            {project.content ? (
              <Markdown content={project.content} />
            ) : (
              <p className="text-muted-foreground italic">
                No detailed explanation provided for this project yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-8">
          <div className="p-6 rounded-2xl border bg-card/50 space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Category
              </h3>
              <Badge variant="secondary" className="text-sm px-3 uppercase">
                {project.category}
              </Badge>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.tech_stack ?? []).map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-background">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              {project.live_demo_link && (
                <Button asChild className="w-full rounded-xl">
                  <a
                    href={project.live_demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_link && (
                <Button variant="outline" asChild className="w-full rounded-xl">
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                </Button>
              )}
              {project.x_link && (
                <Button variant="ghost" asChild className="w-full rounded-xl">
                  <a
                    href={project.x_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on X
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
