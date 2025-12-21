import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Settings, Database, Server, Globe } from "lucide-react";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">
          Admin <GradientText>Settings</GradientText>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Configure platform-wide settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">General Settings</h2>
              <p className="text-sm text-muted-foreground">Platform configuration</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            General platform settings will be configurable here once the backend is integrated.
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Database className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Database</h2>
              <p className="text-sm text-muted-foreground">Data management</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Database configuration and management options will appear here.
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Server className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Backend settings</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            API keys, endpoints, and integration settings will be managed here.
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Globe className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Domain & SEO</h2>
              <p className="text-sm text-muted-foreground">Website settings</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Domain configuration and SEO settings will be available here.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
