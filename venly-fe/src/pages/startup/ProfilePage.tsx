import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProfile, saveProfile, uploadAvatar } from "@/api/profileApi";

const ProfilePage = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [formData, setFormData] = useState({
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

      const res = await uploadAvatar(form, token);

      setFormData((prev) => ({
        ...prev,
        avatar: res.avatar, // make sure backend returns this key
      }));

      toast({ title: "Profile picture updated" });
    } catch (error) {
      toast({
        title: "Avatar upload failed",
        description: "Please try again with a valid image",
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
      await saveProfile(formData, token);
      toast({ title: "Profile updated successfully" });
    } catch {
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- data fetch ---------------- */

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      } catch {
        toast({
          title: "Failed to load profile",
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
          My <GradientText>Profile</GradientText>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and profile picture
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
                  alt="Avatar"
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

          <h3 className="mt-5 text-lg font-semibold">
            {formData.name || "Your Name"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formData.email || "your@email.com"}
          </p>
        </GlassCard>

        {/* Profile Form */}
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
