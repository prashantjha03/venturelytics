import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "startup",
    title: "Startup Owner",
    description: "Manage your startup profile, track metrics, and grow your venture.",
    icon: Building2,
    path: "/startup/dashboard",
    color: "primary",
  },
  {
    id: "admin",
    title: "Administrator",
    description: "Oversee the ecosystem, manage startups, and access analytics.",
    icon: ShieldCheck,
    path: "/admin/dashboard",
    color: "accent",
  },
];

const RoleSelectPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    const role = roles.find((r) => r.id === selectedRole);
    if (role) {
      navigate(role.path);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Select Your <GradientText>Role</GradientText>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose how you want to use Venturelytics
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <GlassCard
              key={role.id}
              hover
              onClick={() => setSelectedRole(role.id)}
              className={cn(
                "p-6 transition-all duration-200",
                isSelected &&
                  `ring-2 ${
                    role.color === "primary" ? "ring-primary" : "ring-accent"
                  }`
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                    role.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      role.color === "primary" ? "text-primary" : "text-accent"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? role.color === "primary"
                        ? "border-primary bg-primary"
                        : "border-accent bg-accent"
                      : "border-border"
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-foreground" />
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Button
        variant="gradient"
        size="lg"
        className="mt-8 w-full"
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default RoleSelectPage;
