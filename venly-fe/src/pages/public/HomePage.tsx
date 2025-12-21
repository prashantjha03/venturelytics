import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import {
  BarChart3,
  Building2,
  LineChart,
  Rocket,
  Shield,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into your startup's performance with comprehensive analytics.",
  },
  {
    icon: Building2,
    title: "Startup Management",
    description: "Manage your startup profile, team members, and documents in one place.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members and collaborate seamlessly on your startup journey.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security ensuring your data is protected at all times.",
  },
  {
    icon: LineChart,
    title: "Growth Tracking",
    description: "Track your funding, milestones, and growth metrics effortlessly.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Streamlined workflows to help you focus on what matters most.",
  },
];

const stats = [
  { value: "500+", label: "Startups Tracked" },
  { value: "$2B+", label: "Funding Managed" },
  { value: "50+", label: "Industries" },
  { value: "99.9%", label: "Uptime" },
];

const HomePage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                <Rocket className="h-4 w-4 text-primary" />
                Empowering the Startup Ecosystem
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up animation-delay-100">
              Track Your Startup's{" "}
              <GradientText>Growth Journey</GradientText>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground sm:text-xl animate-fade-in-up animation-delay-200">
              Venturelytics provides comprehensive tools for startups to manage their ecosystem data, 
              track growth metrics, and gain actionable insights.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-300">
              <Button size="xl" variant="gradient" asChild>
                <Link to="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8 animate-fade-in-up animation-delay-500">
            {stats.map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground lg:text-4xl">
                  <GradientText>{stat.value}</GradientText>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need to{" "}
              <GradientText>Scale</GradientText>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Powerful features designed to help startups manage, track, and grow their ventures.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  hover
                  className="p-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <GlassCard className="relative overflow-hidden p-8 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to <GradientText>Transform</GradientText> Your Startup?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join thousands of founders using Venturelytics to manage their startup ecosystem.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="gradient" asChild>
                  <Link to="/auth/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
