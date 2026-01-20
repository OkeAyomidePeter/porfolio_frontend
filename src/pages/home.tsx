import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProfiles } from "@/lib/data-utils";
import AnimatedContent from "@/components/AnimatedContent";

const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  email: "",
  location: "",
  social_links: {},
  skills: [] as string[],
  stacks: [] as Array<{ name: string; technologies: string[] }>,
  interests: [] as string[],
  what_i_work_on: "",
};

export function Home() {
  const [profileData, setProfileData] =
    useState<typeof defaultProfile>(defaultProfile);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profiles = await getProfiles();
        if (!isMounted) return;
        if (profiles.length > 0) {
          const rawProfile = profiles[0];
          setProfileData({
            ...defaultProfile,
            ...rawProfile,
            stacks: Array.isArray(rawProfile.stacks)
              ? rawProfile.stacks.map((stack: any) => ({
                  name: typeof stack?.name === "string" ? stack.name : "",
                  technologies: Array.isArray(stack?.technologies)
                    ? stack.technologies.map((tech: unknown) => String(tech))
                    : [],
                }))
              : [],
          });
        }
      } catch (error) {
        console.error("Failed to load home profile", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const { name, title, skills, stacks, what_i_work_on } = profileData;
  const normalizedStacks = Array.isArray(stacks)
    ? stacks.map((stack) => ({
        name: typeof stack?.name === "string" ? stack.name : "",
        technologies: Array.isArray(stack?.technologies)
          ? stack.technologies.map((tech: unknown) => String(tech))
          : [],
      }))
    : [];

  return (
    <div className="container px-4 py-12 space-y-16">
      {/* Hero Section */}
      <AnimatedContent
        distance={50}
        duration={1}
        delay={0.2}
        className="space-y-6 text-center"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground via-amber-700/20 to-foreground bg-clip-text text-transparent">
            {name}
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">{title}</p>
        </div>
        <div className="glass-morphism rounded-2xl p-6 regal-shadow">
          <p className="text-lg leading-relaxed">
            I'm Oke Ayomide Peter[Invictus], a software engineer focused on
            designing both simple and complex systems that solve real-world
            problems. I work with modern technologies across AI/ML and web3, and I
            care about building solutions that are scalable, reliable, and
            practical in production environments.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-amber-600/20 to-amber-500/30 border border-amber-400/30 text-foreground shadow-lg hover:from-amber-600/30 hover:to-amber-500/40 hover:border-amber-400/50 hover:shadow-xl backdrop-blur-sm transition-all duration-300"
          >
            <Link to="/projects">My Work</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-amber-400/30 bg-gradient-to-r from-amber-50/20 to-amber-100/20 text-foreground backdrop-blur-sm hover:from-amber-50/40 hover:to-amber-100/40 hover:border-amber-400/50 transition-all duration-300"
          >
            <Link to="/blog">My Blog</Link>
          </Button>
        </div>
      </AnimatedContent>

      {/* What I Work On */}
      <AnimatedContent
        distance={30}
        duration={0.8}
        delay={0.4}
        className="space-y-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">What I Work On</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{what_i_work_on}</p>
      </AnimatedContent>

      {/* Tech Stacks */}
      <AnimatedContent
        distance={30}
        duration={0.8}
        delay={0.6}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Tech Stacks
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {normalizedStacks.map((stack, index) => (
            <div key={`${stack.name ?? "stack"}-${index}`} className="glass-morphism rounded-2xl p-6 regal-shadow hover:scale-105 transition-all duration-300 border border-amber-400/20">
              <h3 className="font-semibold text-lg mb-4">{stack.name}</h3>
              <div className="flex flex-wrap gap-2">
                {stack.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="text-xs bg-amber-50/20 border-amber-400/20 hover:bg-amber-50/40 transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimatedContent>

      {/* Skills */}
      <AnimatedContent
        distance={30}
        duration={0.8}
        delay={0.8}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Skills
        </h2>
        <div className="glass-morphism rounded-2xl p-6 regal-shadow">
          <div className="flex flex-wrap gap-2 justify-center">
            {(skills ?? []).map((skill: string) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-sm py-1.5 px-3 bg-amber-50/20 border-amber-400/30 hover:bg-amber-50/40 hover:border-amber-400/50 transition-all duration-300"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
