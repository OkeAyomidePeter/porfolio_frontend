import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPrimaryProfile } from "@/lib/data-utils";
import { Markdown } from "@/components/markdown";

const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  location: "",
  skills: [] as string[],
  interests: [] as string[],
};

export function About() {
  const [profileData, setProfileData] = useState(defaultProfile);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await getPrimaryProfile();
        if (profile && isMounted) {
          setProfileData({
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            location: profile.location,
            skills: profile.skills,
            interests: profile.interests,
          });
        }
      } catch (error) {
        console.error("Failed to load about profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { name, title, bio, skills, interests, location } = profileData;

  return (
    <div className="container px-4 py-12 space-y-12 text-center">
      {/* Profile Section */}
      <section className="space-y-8 flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative h-48 w-48 rounded-full overflow-hidden border-2 border-amber-400/30 glass-morphism regal-shadow">
            <img
              src="/mypic.png"
              alt={name || "Profile Picture"}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/400x400?text=Profile";
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            {name}
          </h1>
          <p className="text-xl text-amber-500/90 font-medium">{title}</p>
          {location && (
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50" />
              {location}
            </p>
          )}
        </div>
        <div className="max-w-2xl mx-auto">
          <Markdown
            content={bio}
            className="text-lg leading-relaxed text-muted-foreground"
          />
        </div>
      </section>

      <Separator />

      {/* Skills Highlights */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Skills Highlights</h2>
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              Technologies and tools I work with regularly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(skills ?? []).map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-sm py-1.5 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Personal Interests */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Personal Interests
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>What I Enjoy</CardTitle>
            <CardDescription>
              Things I'm passionate about outside of coding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(interests ?? []).map((interest: string) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="text-sm py-1.5 px-3"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
