import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Heart } from "lucide-react";
import {
  buildAssetUrl,
  getBlog,
  likeBlog,
  type Blog as BlogType,
} from "@/lib/data-utils";
import { Markdown } from "@/components/markdown";

const LIKED_BLOGS_KEY = "liked_blog_ids";

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [post, setPost] = useState<BlogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has already liked this post
  useEffect(() => {
    if (!id) return;
    try {
      const likedBlogs = JSON.parse(
        localStorage.getItem(LIKED_BLOGS_KEY) || "[]",
      );
      setLiked(likedBlogs.includes(Number(id)));
    } catch (error) {
      console.error("Error reading liked blogs from localStorage", error);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getBlog(Number(id));
        if (isMounted) {
          setPost(data);
        }
      } catch (error) {
        console.error("Failed to load blog post", error);
        if (isMounted) {
          setError("Post not found");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="container px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLike = async () => {
    if (!id || !post || liked || isLiking) return;

    try {
      setIsLiking(true);
      const updatedBlog = await likeBlog(Number(id));

      // Update the post with new like count
      setPost(updatedBlog);
      setLiked(true);

      // Store in localStorage to prevent duplicate likes
      try {
        const likedBlogs = JSON.parse(
          localStorage.getItem(LIKED_BLOGS_KEY) || "[]",
        );
        if (!likedBlogs.includes(Number(id))) {
          likedBlogs.push(Number(id));
          localStorage.setItem(LIKED_BLOGS_KEY, JSON.stringify(likedBlogs));
        }
      } catch (error) {
        console.error("Error saving liked blog to localStorage", error);
      }
    } catch (error) {
      console.error("Failed to like blog post", error);
      // You could show an error message to the user here
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="container px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/blog")}
        className="mb-8"
      >
        ← Back to Blog
      </Button>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.read_time}</span>
            </div>
            <span>By {post.author}</span>
          </div>
        </header>

        {post.thumbnail_path && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <img
              src={
                buildAssetUrl(post.thumbnail_path) ??
                "https://placehold.co/1200x800"
              }
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <Markdown content={post.content} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleLike}
            disabled={liked || isLiking}
            className={liked ? "text-red-500" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
            {isLiking
              ? "Liking..."
              : liked
                ? `Liked (${post.likes})`
                : `Like (${post.likes})`}
          </Button>
          {liked && (
            <p className="text-sm text-muted-foreground">
              Thank you for your support! 💙
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
