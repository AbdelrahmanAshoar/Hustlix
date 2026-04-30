import Image from "next/image";
import { Camera, FileText, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SettingsSectionHeader from "./SettingsSectionHeader";

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  bio: string;
  profilePictureUrl: string;
}

interface PublicProfileSectionProps {
  formData: ProfileFormData;
  address: string;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e?: React.FormEvent) => void | Promise<void>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddressChange: (value: string) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getImageSrc: (img?: string) => string;
}

export default function PublicProfileSection({
  formData,
  address,
  loading,
  fileInputRef,
  onSubmit,
  onFormChange,
  onAddressChange,
  onFileInput,
  getImageSrc,
}: PublicProfileSectionProps) {
  return (
    <>
      <SettingsSectionHeader
        title="Public Profile"
        description="This information will be visible to others on the platform."
      />

      <form onSubmit={(e) => void onSubmit(e)}>
        <div className="flex gap-10">
          <div className="flex-1 space-y-6">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" /> Full Name
              </Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={onFormChange}
                placeholder="Your full name"
              />
              <p className="text-xs text-muted-foreground">
                Your name may appear across the platform where you contribute.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Phone className="h-4 w-4 text-muted-foreground" /> Phone
              </Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onFormChange}
                placeholder="+20 xxx xxx xxxx"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" /> Address
              </Label>
              <Input
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                placeholder="Your address"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" /> Bio
              </Label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={onFormChange}
                placeholder="Tell us a little bit about yourself"
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">You can @mention others to link to them.</p>
            </div>

            <div className="border-t border-border pt-2">
              <Button type="submit" disabled={loading} className="px-5">
                {loading ? "Saving..." : "Update profile"}
              </Button>
            </div>
          </div>

          <div className="w-56 shrink-0 space-y-3">
            <p className="text-sm font-medium text-foreground">Profile picture</p>

            <div className="group relative">
              <div className="mx-auto h-48 w-48 overflow-hidden rounded-full border-2 border-border">
                <Image
                  src={getImageSrc(formData.profilePictureUrl) || "/default.png"}
                  alt="Profile picture"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="flex flex-col items-center gap-1 text-white">
                  <Camera className="h-6 w-6" />
                  <span className="text-xs font-medium">Edit</span>
                </span>
              </button>
            </div>

            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={onFileInput} />

            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Change photo
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
