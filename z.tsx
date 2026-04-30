"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  User,
  Phone,
  FileText,
  Camera,
  Briefcase,
  Link,
  ChevronRight,
  Mail,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function normalizeImageUrl(url?: string | null) {
  if (!url) return "/default.png";
  if (url.startsWith("data:image")) return url;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

type Tab = "profile" | "account" | "professional" | "portfolio";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    profilePictureUrl: "",
  });

  // account
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  // professional
  const [jobTitle, setJobTitle] = useState("");
  const [payPalEmail, setPayPalEmail] = useState("");
  const [cvFile, setcvFile] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // portfolio
  const [mainLink, setMainLink] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");

  // progress
  const [profileProgress, setProfileProgress] = useState(0);

  const [avatarPreview, setAvatarPreview] = useState<string>("/default.png");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/User/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json();

        console.log("PROFILE DATA:", data);
        const photo = data?.personalInfo?.photoUrl;

        setFormData((prev) => ({
          ...prev,
          fullName: data.personalInfo?.fullName ?? prev.fullName,
          phoneNumber: data.personalInfo?.phone ?? prev.phoneNumber,
          bio: data.professionalInfo?.about ?? prev.bio,
          profilePictureUrl: photo ?? prev.profilePictureUrl,
        }));
        if (photo) {
          setAvatarPreview(photo);
        }
        // ✅ استخدم الفنكشن الصح
        setAvatarPreview(getImageSrc(data.profilePictureUrl));

        // account
        setEmail(data.auth?.email ?? "");
        setUserRole(data.auth?.userRole ?? "");

        // professional
        setJobTitle(data.professionalInfo?.jobTitle ?? "");
        setPayPalEmail(data.professionalInfo?.payPalEmail ?? "");
        setcvFile(data.professionalInfo?.cvFile ?? "");
        setSkills(data.professionalInfo?.skills ?? []);

        // portfolio
        setMainLink(data.portfolio?.mainLink ?? "");
        setProjects(data.portfolio?.projects ?? []);

        // progress
        setProfileProgress(data.profileProgress ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    function getImageSrc(img?: string | null) {
      if (!img) return "/default.png";

      if (img.startsWith("data:image")) return img;

      if (img.startsWith("http")) return img;

      return `${API_BASE_URL}${img}`;
    }

    fetchProfile();
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
      });

      setAvatarPreview(normalizeImageUrl(user.profilePictureUrl));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload valid image");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    toast.info("Press 'Update profile' to save your new photo.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Full name required");
      return;
    }
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) { toast.error("Login first"); return; }

      const form = new FormData();
      form.append("FullName", formData.fullName);
      form.append("PhoneNumber", formData.phoneNumber);
      form.append("Bio", formData.bio);
      if (fileInputRef.current?.files?.[0]) {
        form.append("ProfilePicture", fileInputRef.current.files[0]);
      }

      const response = await fetch(`${API_BASE_URL}/api/User/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || "Update failed");

      const newPhotoUrl = normalizeImageUrl(
        result?.profilePictureUrl || user?.profilePictureUrl
      );

      updateUser({
        fullName: formData.fullName,
        profilePictureUrl: newPhotoUrl,
      });

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (img?: string) => {
    if (!img) return "/default.png";
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("http")) return img;
    return `${API_BASE_URL}${img}`;
  };

  const navItems = [
    { key: "profile" as Tab, label: "Public Profile", icon: User },
    { key: "account" as Tab, label: "Account", icon: Mail },
    { key: "professional" as Tab, label: "Professional Info", icon: Briefcase },
    { key: "portfolio" as Tab, label: "Portfolio", icon: Link },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {profileProgress.toFixed(0)}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">

            {/* ===== TAB: Public Profile ===== */}
            {activeTab === "profile" && (
              <>
                <div className="mb-6 pb-4 border-b border-border">
                  <h2 className="text-2xl font-semibold text-foreground">Public Profile</h2>
                  <p className="text-sm text-muted-foreground mt-1">This information will be visible to others on the platform.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex gap-10">
                    {/* Left – fields */}
                    <div className="flex-1 space-y-6">

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                          <User className="w-4 h-4 text-muted-foreground" /> Full Name
                        </Label>
                        <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                        <p className="text-xs text-muted-foreground">Your name may appear across the platform where you contribute.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-muted-foreground" /> Phone
                        </Label>
                        <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+20 xxx xxx xxxx" />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-muted-foreground" /> Bio
                        </Label>
                        <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us a little bit about yourself" rows={4} className="resize-none" />
                        <p className="text-xs text-muted-foreground">You can @mention others to link to them.</p>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <Button type="submit" disabled={loading} className="px-5">
                          {loading ? "Saving..." : "Update profile"}
                        </Button>
                      </div>
                    </div>

                    {/* Right – avatar (untouched logic) */}
                    <div className="w-56 flex-shrink-0 space-y-3">
                      <p className="text-sm font-medium text-foreground">Profile picture</p>

                      <div className="relative group">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-border mx-auto">
                          <Image
                            src={getImageSrc(formData.profilePictureUrl) || "/default.png"}
                            alt="Profile picture"
                            width={192}
                            height={192}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity mx-auto w-48 h-48"
                        >
                          <div className="flex flex-col items-center gap-1 text-white">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs font-medium">Edit</span>
                          </div>
                        </button>
                      </div>

                      <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileInput} />

                      <div className="text-center">
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full text-xs">
                          <Camera className="w-3.5 h-3.5 mr-1.5" /> Change photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}

            {/* ===== TAB: Account ===== */}
            {activeTab === "account" && (
              <>
                <div className="mb-6 pb-4 border-b border-border">
                  <h2 className="text-2xl font-semibold text-foreground">Account</h2>
                  <p className="text-sm text-muted-foreground mt-1">Your account details and role information.</p>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Email address
                    </Label>
                    <Input value={email} disabled className="bg-muted cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground">Your email address is managed by your account provider.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-muted-foreground" /> Role
                    </Label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{userRole || "—"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Your role determines what you can do on the platform.</p>
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB: Professional Info ===== */}
            {activeTab === "professional" && (
              <>
                <div className="mb-6 pb-4 border-b border-border">
                  <h2 className="text-2xl font-semibold text-foreground">Professional Info</h2>
                  <p className="text-sm text-muted-foreground mt-1">Details about your professional background.</p>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-muted-foreground" /> Job Title
                    </Label>
                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-muted-foreground" /> PayPal Email
                    </Label>
                    <Input value={payPalEmail} onChange={(e) => setPayPalEmail(e.target.value)} placeholder="your-paypal@email.com" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Link className="w-4 h-4 text-muted-foreground" /> CV URL
                    </Label>
                    <Input value={cvFile} onChange={(e) => setcvFile(e.target.value)} placeholder="https://your-cv-link.com" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (skillInput.trim()) {
                              setSkills((prev) => [...prev, skillInput.trim()]);
                              setSkillInput("");
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={() => {
                        if (skillInput.trim()) {
                          setSkills((prev) => [...prev, skillInput.trim()]);
                          setSkillInput("");
                        }
                      }}>Add</Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, i) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm text-foreground">
                            {skill}
                            <button type="button" onClick={() => setSkills((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive ml-1">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Button className="px-5">Save changes</Button>
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB: Portfolio ===== */}
            {activeTab === "portfolio" && (
              <>
                <div className="mb-6 pb-4 border-b border-border">
                  <h2 className="text-2xl font-semibold text-foreground">Portfolio</h2>
                  <p className="text-sm text-muted-foreground mt-1">Showcase your work and projects.</p>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Link className="w-4 h-4 text-muted-foreground" /> Main Portfolio Link
                    </Label>
                    <Input value={mainLink} onChange={(e) => setMainLink(e.target.value)} placeholder="https://your-portfolio.com" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Projects</Label>
                    <div className="flex gap-2">
                      <Input
                        value={projectInput}
                        onChange={(e) => setProjectInput(e.target.value)}
                        placeholder="Add a project URL..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (projectInput.trim()) {
                              setProjects((prev) => [...prev, projectInput.trim()]);
                              setProjectInput("");
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={() => {
                        if (projectInput.trim()) {
                          setProjects((prev) => [...prev, projectInput.trim()]);
                          setProjectInput("");
                        }
                      }}>Add</Button>
                    </div>
                    {projects.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {projects.map((project, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md border border-border bg-muted">
                            <a href={project} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-xs">{project}</a>
                            <button type="button" onClick={() => setProjects((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive ml-2 flex-shrink-0">×</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No projects added yet.</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Button className="px-5">Save changes</Button>
                  </div>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}





{/* Progress or Rating */}
        {auth.userRole === "freelancer" ? (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${freelancerProgress}%` }}
              />
            </div>
            <p className="text-sm mt-1">{freelancerProgress}% completed</p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Average Rating:</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (data.averageRating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {data.averageRating ? `${data.averageRating.toFixed(1)}/5` : "No ratings yet"}
                </span>
              </div>
            </div>
          </div>
        )}