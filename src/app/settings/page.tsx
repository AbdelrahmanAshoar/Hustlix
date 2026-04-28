"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  bio: string;
  profilePictureUrl: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function SettingsPage() {
  const { user, userRole, updateUser } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    phoneNumber: "",
    bio: "",
    profilePictureUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        profilePictureUrl: prev.profilePictureUrl || user.profilePictureUrl || "",
      }));
      if (user.profilePictureUrl) {
        setAvatarPreview(user.profilePictureUrl);
      }
    }

    const fetchProfile = async () => {
      if (userRole !== "Freelancer") {
        return;
      }

      const token = getCookie("token");
      if (!token) return;

      try {
        const response = await fetch(
          "http://proafree.runasp.net/api/Freelancer/my-portfolio",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          console.error("Failed to load profile:", response.status, response.statusText);
          return;
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          fullName: data.fullName ?? prev.fullName,
          phoneNumber: data.phoneNumber ?? prev.phoneNumber,
          bio: data.bio ?? prev.bio,
          profilePictureUrl: data.profilePictureUrl ?? prev.profilePictureUrl,
        }));

        if (data.profilePictureUrl) {
          setAvatarPreview(data.profilePictureUrl);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [user, userRole]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
      // In a real app, you'd upload the image to a storage service
      // and get back a URL to store. For now we simulate with a placeholder.
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: result, // replace with real uploaded URL
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast("Full name is required.", "error");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("Please login first.", "error");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://proafree.runasp.net/api/User/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            bio: formData.bio,
            profilePictureUrl: formData.profilePictureUrl,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || `Failed to update profile. (${response.status})`);
      }

      updateUser({
        fullName: result?.fullName ?? formData.fullName,
        profilePictureUrl:
          result?.profilePictureUrl ?? (formData.profilePictureUrl || user?.profilePictureUrl || null),
      });

      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-root">
      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="settings-header-left">
            <h1 className="settings-title">Account Settings</h1>
            <p className="settings-subtitle">
              Manage your public profile and personal details
            </p>
          </div>
          <div className="settings-header-badge">Profile</div>
        </div>

        <div className="settings-body">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-label">Profile Photo</div>
            <div
              className={`avatar-upload-zone ${isDragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="avatar-preview-img"
                  width={120}
                  height={120}
                  unoptimized
                />
              ) : (
                <div className="avatar-placeholder">
                  <div className="avatar-placeholder-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="avatar-placeholder-text">
                    Drop photo here or{" "}
                    <span className="avatar-placeholder-link">browse</span>
                  </span>
                  <span className="avatar-placeholder-hint">
                    PNG, JPG up to 5MB
                  </span>
                </div>
              )}
              <div className="avatar-overlay">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  width="22"
                  height="22"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Change photo</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Abdelrahman Ashour"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.61a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Profile Picture URL */}
              <div className="form-group form-group-full">
                <label className="form-label">Profile Picture URL</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </span>
                  <input
                    type="url"
                    name="profilePictureUrl"
                    value={formData.profilePictureUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="form-input"
                  />
                </div>
                <p className="form-hint">
                  Or upload a photo above — the URL will be filled automatically
                </p>
              </div>

              {/* Bio */}
              <div className="form-group form-group-full">
                <label className="form-label">Bio</label>
                <div className="textarea-wrapper">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself or your company..."
                    className="form-textarea"
                    rows={4}
                    maxLength={500}
                  />
                  <span className="char-count">
                    {formData.bio.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFormData({
                    fullName: "",
                    phoneNumber: "",
                    bio: "",
                    profilePictureUrl: "",
                  });
                  setAvatarPreview("");
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="16"
                      height="16"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .settings-root {
          min-height: 100vh;
          background: #f5f5f7;
          padding: 40px 20px;
          font-family: -apple-system, "SF Pro Display", "Segoe UI", sans-serif;
        }

        /* Toast */
        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          animation: slideIn 0.3s ease;
          max-width: 340px;
        }
        .toast-success {
          background: #1c1c1e;
          color: #fff;
        }
        .toast-error {
          background: #ff3b30;
          color: #fff;
        }
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Container */
        .settings-container {
          max-width: 720px;
          margin: 0 auto;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        /* Header */
        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 40px 28px;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
        }
        .settings-title {
          font-size: 22px;
          font-weight: 700;
          color: #1c1c1e;
          margin: 0 0 4px;
          letter-spacing: -0.4px;
        }
        .settings-subtitle {
          font-size: 14px;
          color: #8e8e93;
          margin: 0;
        }
        .settings-header-badge {
          background: #eef2ff;
          color: #4f6ef7;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          letter-spacing: 0.2px;
        }

        /* Body */
        .settings-body {
          padding: 36px 40px 40px;
        }

        /* Avatar */
        .avatar-section {
          margin-bottom: 32px;
        }
        .avatar-label {
          font-size: 13px;
          font-weight: 600;
          color: #1c1c1e;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .avatar-upload-zone {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 2px dashed #d1d1d6;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          background: #f8f8fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-upload-zone:hover {
          border-color: #4f6ef7;
          transform: scale(1.02);
        }
        .avatar-upload-zone.dragging {
          border-color: #4f6ef7;
          background: #eef2ff;
        }
        .avatar-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 12px;
          text-align: center;
        }
        .avatar-placeholder-icon {
          color: #c7c7cc;
          width: 32px;
          height: 32px;
          margin-bottom: 4px;
        }
        .avatar-placeholder-icon svg {
          width: 100%;
          height: 100%;
        }
        .avatar-placeholder-text {
          font-size: 10px;
          color: #8e8e93;
          line-height: 1.4;
        }
        .avatar-placeholder-link {
          color: #4f6ef7;
          font-weight: 600;
        }
        .avatar-placeholder-hint {
          font-size: 9px;
          color: #c7c7cc;
        }
        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          color: white;
          font-size: 10px;
          font-weight: 600;
        }
        .avatar-upload-zone:hover .avatar-overlay {
          opacity: 1;
        }

        .divider {
          height: 1px;
          background: #f0f0f0;
          margin-bottom: 32px;
        }

        /* Form */
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-bottom: 32px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group-full {
          grid-column: 1 / -1;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #1c1c1e;
          letter-spacing: 0.1px;
        }
        .required {
          color: #ff3b30;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: #c7c7cc;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          pointer-events: none;
          flex-shrink: 0;
        }
        .input-icon svg {
          width: 100%;
          height: 100%;
        }
        .form-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #e5e5ea;
          border-radius: 12px;
          font-size: 14px;
          color: #1c1c1e;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .form-input::placeholder {
          color: #c7c7cc;
        }
        .form-input:focus {
          border-color: #4f6ef7;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
        }
        .textarea-wrapper {
          position: relative;
        }
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e5ea;
          border-radius: 12px;
          font-size: 14px;
          color: #1c1c1e;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
          line-height: 1.6;
          box-sizing: border-box;
        }
        .form-textarea::placeholder {
          color: #c7c7cc;
        }
        .form-textarea:focus {
          border-color: #4f6ef7;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
        }
        .char-count {
          position: absolute;
          bottom: 10px;
          right: 14px;
          font-size: 11px;
          color: #c7c7cc;
          pointer-events: none;
        }
        .form-hint {
          font-size: 12px;
          color: #aeaeb2;
          margin: 0;
          line-height: 1.5;
        }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-secondary {
          padding: 12px 24px;
          border-radius: 12px;
          border: 1.5px solid #e5e5ea;
          background: #fff;
          color: #636366;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          font-family: inherit;
        }
        .btn-secondary:hover {
          background: #f5f5f7;
          border-color: #d1d1d6;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: #1c1c1e;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: inherit;
        }
        .btn-primary:hover:not(:disabled) {
          background: #3a3a3c;
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .settings-header {
            padding: 24px 24px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .settings-body {
            padding: 24px 24px 32px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group-full {
            grid-column: 1;
          }
          .form-actions {
            flex-direction: column;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}