import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, ShieldCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAdminProfile,
  saveAdminProfile,
  uploadAdminAvatar,
} from "@/api/adminProfileApi";

interface AdminProfileForm {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

const AdminProfile = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [formData, setFormData] = useState<AdminProfileForm>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
  });
  

  /* ---------------- handlers ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setAvatarLoading(true);

      const form = new FormData();
      form.append("avatar", file);

      const res = await uploadAdminAvatar(form, token);

      setFormData((prev) => ({
        ...prev,
        avatar: res.avatar,
      }));

      toast({ title: "Admin avatar updated successfully" });
    } catch {
      toast({
        title: "Avatar upload failed",
        description: "Please upload a valid image",
        variant: "destructive",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      await saveAdminProfile(formData, token);
      toast({ title: "Admin profile updated" });
    } catch {
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- fetch profile ---------------- */

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile(token);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      } catch {
        toast({
          title: "Failed to load admin profile",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [token, toast]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Admin <GradientText>Profile</GradientText>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage administrator details and security identity
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Avatar Card */}
        <GlassCard className="p-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-36 w-36 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Admin Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-14 w-14 text-muted-foreground" />
              )}
            </div>

            <label className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-card border flex items-center justify-center cursor-pointer hover:bg-muted transition">
              {avatarLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <h3 className="mt-5 text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {formData.name || "Admin Name"}
          </h3>

          <p className="text-sm text-muted-foreground">
            {formData.email || "admin@email.com"}
          </p>
        </GlassCard>

        {/* Admin Profile Form */}
        <GlassCard className="p-8 xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Save Admin Profile"
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>

    
  );
  
};

export default AdminProfile;
