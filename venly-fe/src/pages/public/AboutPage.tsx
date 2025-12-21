import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Target, Eye, Heart, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're committed to empowering startups with the tools they need to succeed.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Open communication and honest dealings are at the core of everything we do.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Building a supportive ecosystem where startups can thrive together.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Constantly evolving our platform to meet the changing needs of startups.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "The Beginning",
    description: "Venturelytics was founded with a vision to transform startup ecosystem management.",
  },
  {
    year: "2022",
    title: "Rapid Growth",
    description: "Onboarded 100+ startups and launched our analytics dashboard.",
  },
  {
    year: "2023",
    title: "Expansion",
    description: "Expanded to 50+ industries and introduced team collaboration features.",
  },
  {
    year: "2024",
    title: "Going Global",
    description: "Reached 500+ startups worldwide with multi-language support.",
  },
];

const AboutPage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-20 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl animate-fade-in-up">
              About <GradientText>Venturelytics</GradientText>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground animate-fade-in-up animation-delay-100">
              We're on a mission to democratize access to powerful startup management tools, 
              helping entrepreneurs and innovators turn their visions into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-3xl font-bold">
                Our <GradientText>Vision</GradientText>
              </h2>
              <p className="mt-4 text-muted-foreground">
                To become the leading platform for startup ecosystem management, where every 
                entrepreneur has access to enterprise-grade tools and insights to build 
                successful ventures.
              </p>
              <p className="mt-4 text-muted-foreground">
                We believe that great ideas deserve great tools. Our platform is designed to 
                level the playing field, giving startups of all sizes the analytics, 
                management capabilities, and insights they need to compete and grow.
              </p>
            </div>
            <div className="relative animate-fade-in-right">
              <GlassCard className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">500+</div>
                    <div className="mt-1 text-sm text-muted-foreground">Active Startups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">50+</div>
                    <div className="mt-1 text-sm text-muted-foreground">Industries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">$2B+</div>
                    <div className="mt-1 text-sm text-muted-foreground">Funding Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">24/7</div>
                    <div className="mt-1 text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Our <GradientText>Values</GradientText>
            </h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do at Venturelytics.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <GlassCard
                  key={value.title}
                  hover
                  className="p-6 text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Our <GradientText>Journey</GradientText>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Key milestones in the Venturelytics story.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-3xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative mb-8 flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full gradient-bg md:left-1/2">
                    <span className="text-xs font-bold text-primary-foreground">
                      {item.year.slice(-2)}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-12 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <GlassCard className="p-4 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                      <div className="text-sm font-semibold text-primary">{item.year}</div>
                      <h3 className="mt-1 font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </GlassCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
