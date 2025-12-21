import { Outlet, Link } from "react-router-dom";
import { GradientText } from "@/components/ui/GradientText";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-card/30 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
            <span className="text-lg font-bold text-primary-foreground">V</span>
          </div>
          <GradientText className="text-xl font-bold">Venturelytics</GradientText>
        </Link>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold">
              <GradientText>Track. Analyze. Grow.</GradientText>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of startups using Venturelytics to manage their ecosystem data and gain actionable insights.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Venturelytics. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
              <span className="text-lg font-bold text-primary-foreground">V</span>
            </div>
            <GradientText className="text-xl font-bold">Venturelytics</GradientText>
          </Link>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
