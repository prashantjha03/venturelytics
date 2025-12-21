import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Github, Linkedin, Globe } from "lucide-react";

const teamMembers = [
  {
    name: "Prashant Kumar Jha",
    bio: "Full-stack developer with years of experience building scalable web applications.",
    avatar: "/prashant.png",
    links: {
      github: "#",
      linkedin: "#",
      portfolio: "#",
    },
  },
  {
    name: "Harsh Jha",
    bio: "Passionate about creating beautiful and accessible user interfaces with modern technologies.",
    avatar: "/harsh.png",
    links: {
      github: "#",
      linkedin: "#",
      portfolio: "#",
    },
  },
  {
    name: "Aditya",
    bio: "Specializes in building robust APIs and microservices architecture for high-performance systems.",
    avatar: "/aditya.png",
    links: {
      github: "#",
      linkedin: "#",
      portfolio: "#",
    },
  },
];

const TeamPage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Meet Our <GradientText>Team</GradientText>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-muted-foreground">
            The talented developers behind Venturelytics.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="relative pb-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <GlassCard
                key={member.name}
                hover
                className="
                  flex flex-col items-center justify-center
                  text-center
                  min-h-[420px]
                  px-8 py-10
                  animate-fade-in-up
                "
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Avatar */}
                <div className="relative mb-6 h-32 w-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-md opacity-50" />
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-border">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold">
                  {member.name}
                </h3>

                {/* Bio */}
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  {member.bio}
                </p>

                {/* Icons */}
                <div className="mt-6 flex gap-5">
                  <a className="icon-btn"><Github size={18} /></a>
                  <a className="icon-btn"><Linkedin size={18} /></a>
                  <a className="icon-btn"><Globe size={18} /></a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
