"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Briefcase, Link, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/config";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import PublicProfileSection from "@/components/settings/PublicProfileSection";
import AccountSection from "@/components/settings/AccountSection";
import ProfessionalInfoSection from "@/components/settings/ProfessionalInfoSection";
import PortfolioSection from "@/components/settings/PortfolioSection";
import type { SettingsTab } from "@/components/settings/types";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    profilePictureUrl: "",
  });

  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [payPalEmail, setPayPalEmail] = useState("");
  const [cvFile, setCvFile] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillRelevanceScore, setSkillRelevanceScore] = useState("");

  const [mainLink, setMainLink] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");

  const [skillLoading, setSkillLoading] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvFileRef = useRef<HTMLInputElement>(null);

  const freelancerApiBase = `${API_BASE_URL}/api/Freelancer`;
  const effectiveRole = userRole || user?.role || "";
  const isClient = effectiveRole === "Client";
  const isFreelancer = effectiveRole === "Freelancer";

  const fetchFreelancerSkills = useCallback(async () => {
    if (!isFreelancer) return;
    const token = getCookie("token");
    if (!token) return;

    try {
      const res = await fetch(`${freelancerApiBase}/my-skills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const payload = await res.json();
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: unknown }).data)
        ? (payload as { data?: unknown }).data
        : [];

      const parsedSkills = (rawList as unknown[])
        .filter(
          (item): item is { name: string } =>
            typeof item === "object" &&
            item !== null &&
            "name" in item &&
            typeof (item as { name?: unknown }).name === "string"
        )
        .map((item) => item.name);

      if (parsedSkills.length > 0) {
        setSkills(parsedSkills);
      }
    } catch (error) {
      console.error("Failed to fetch freelancer skills", error);
    }
  }, [isFreelancer, freelancerApiBase]);

  const handleAddSkill = async () => {
    const name = skillName.trim();
    const category = skillCategory.trim() || "general";
    const relevanceScore = Number(skillRelevanceScore);

    if (!name) {
      toast.error("Skill name is required");
      return;
    }
    if (!skillCategory.trim()) {
      toast.error("Skill category is required");
      return;
    }
    if (!skillRelevanceScore.trim() || Number.isNaN(relevanceScore) || relevanceScore < 0 || relevanceScore > 100) {
      toast.error("Enter a relevance score between 0 and 100");
      return;
    }

    setSkillLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Login first");
        return;
      }

      const response = await fetch(`${freelancerApiBase}/add-skill`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category, relevanceScore }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || "Unable to add skill");

      setSkillName("");
      setSkillCategory("");
      setSkillRelevanceScore("");
      await fetchFreelancerSkills();
      toast.success(`Skill "${name}" added successfully`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to add skill";
      toast.error(message);
    } finally {
      setSkillLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/User/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json();

        const photo = data?.personalInfo?.photoUrl;
        setFormData((prev) => ({
          ...prev,
          fullName: data.personalInfo?.fullName ?? prev.fullName,
          phoneNumber: data.personalInfo?.phone ?? prev.phoneNumber,
          bio: data.professionalInfo?.about ?? prev.bio,
          profilePictureUrl: photo ?? prev.profilePictureUrl,
        }));

        setAddress(data.personalInfo?.address ?? "");
        setEmail(data.auth?.email ?? "");
        const fetchedRole = data.auth?.userRole ?? "";
        setUserRole(fetchedRole);

        setJobTitle(data.professionalInfo?.jobTitle ?? "");
        setPayPalEmail(data.professionalInfo?.payPalEmail ?? "");
        setCvFile(data.professionalInfo?.cvFile ?? "");
        setSkills(data.professionalInfo?.skills ?? []);

        setMainLink(data.portfolio?.mainLink ?? "");
        setProjects(data.portfolio?.projects ?? []);
        setProfileProgress(data.profileProgress ?? 0);

        if (fetchedRole === "Freelancer") {
          await fetchFreelancerSkills();
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        profilePictureUrl: normalizeImageUrl(user.profilePictureUrl),
      }));
    }
  }, [user, fetchFreelancerSkills]);

  useEffect(() => {
    if (!isFreelancer && (activeTab === "professional" || activeTab === "portfolio")) {
      setActiveTab("profile");
    }
  }, [activeTab, isFreelancer]);

  const handleAddProject = () => {
    if (!projectInput.trim()) return;
    setProjects((prev) => [...prev, projectInput.trim()]);
    setProjectInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setFormData((prev) => ({ ...prev, profilePictureUrl: previewUrl }));
    toast.info("Press 'Update profile' to save your new photo.");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Full name required");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Login first");
        return;
      }

      const form = new FormData();
      form.append("FullName", formData.fullName);
      form.append("PhoneNumber", formData.phoneNumber);
      form.append("Bio", formData.bio);
      form.append("Address", address);

      if (isFreelancer) {
        form.append("JobTitle", jobTitle);
        form.append("PortfolioUrl", mainLink);
      }
      if (fileInputRef.current?.files?.[0]) {
        form.append("ProfilePicture", fileInputRef.current.files[0]);
      }
      if (isFreelancer && cvFileRef.current?.files?.[0]) {
        form.append("cvFile", cvFileRef.current.files[0]);
      }
      if (isFreelancer) {
        skills.forEach((skill) => form.append("Skills", skill));
        projects.forEach((project) => form.append("Projects", project));
      }

      const response = await fetch(`${API_BASE_URL}/api/User/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || "Update failed");

      const newPhotoUrl = normalizeImageUrl(result?.profilePictureUrl || user?.profilePictureUrl);
      updateUser({
        fullName: formData.fullName,
        profilePictureUrl: newPhotoUrl,
      });

      if (isFreelancer) {
        await fetchFreelancerSkills();
      }
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { key: "profile" as SettingsTab, label: "Public Profile", icon: User },
    { key: "account" as SettingsTab, label: "Account", icon: Mail },
    ...(isFreelancer
      ? [{ key: "professional" as SettingsTab, label: "Professional Info", icon: Briefcase }]
      : []),
    ...(isFreelancer ? [{ key: "portfolio" as SettingsTab, label: "Portfolio", icon: Link }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SettingsPageHeader isClient={isClient} profileProgress={profileProgress} />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-8">
          <SettingsSidebar items={navItems} activeTab={activeTab} onChangeTab={setActiveTab} />

          <main className="min-w-0 flex-1">
            {activeTab === "profile" && (
              <PublicProfileSection
                formData={formData}
                address={address}
                loading={loading}
                fileInputRef={fileInputRef}
                onSubmit={handleSubmit}
                onFormChange={handleChange}
                onAddressChange={setAddress}
                onFileInput={handleFileInput}
                getImageSrc={normalizeImageUrl}
              />
            )}

            {activeTab === "account" && <AccountSection email={email} userRole={userRole} />}

            {isFreelancer && activeTab === "professional" && (
              <ProfessionalInfoSection
                jobTitle={jobTitle}
                payPalEmail={payPalEmail}
                cvFile={cvFile}
                skills={skills}
                skillName={skillName}
                skillCategory={skillCategory}
                skillRelevanceScore={skillRelevanceScore}
                skillLoading={skillLoading}
                loading={loading}
                cvFileRef={cvFileRef}
                onJobTitleChange={setJobTitle}
                onPayPalEmailChange={setPayPalEmail}
                onSkillNameChange={setSkillName}
                onSkillCategoryChange={setSkillCategory}
                onSkillRelevanceScoreChange={setSkillRelevanceScore}
                onAddSkill={handleAddSkill}
                onRemoveSkill={(index) => setSkills((prev) => prev.filter((_, idx) => idx !== index))}
                onSave={handleSubmit}
                onCvSelect={(fileName) => toast.info(`CV "${fileName}" selected. Press Save to upload.`)}
              />
            )}

            {isFreelancer && activeTab === "portfolio" && (
              <PortfolioSection
                mainLink={mainLink}
                projects={projects}
                projectInput={projectInput}
                loading={loading}
                onMainLinkChange={setMainLink}
                onProjectInputChange={setProjectInput}
                onAddProject={handleAddProject}
                onRemoveProject={(index) => setProjects((prev) => prev.filter((_, idx) => idx !== index))}
                onSave={handleSubmit}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
