import { useMemo, useState } from "react";
import "./ProfileShared.css";

const cloudName = "dhuzkhdh1";
const uploadPreset = "IntershipAttachment";
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

type EditProfileCardProps = {
  username: string;
  photo?: string;
  onCancel: () => void;
  onSave: (data: { username: string; photo: string }) => void;
};

export default function EditProfileCard({
  username,
  photo = "",
  onCancel,
  onSave,
}: EditProfileCardProps) {
  const [draftUsername, setDraftUsername] = useState(
    username.startsWith("@") ? username : `@${username}`,
  );
  const [draftPhoto, setDraftPhoto] = useState(photo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const previewContent = useMemo(() => {
    if (draftPhoto.trim()) {
      return (
        <img
          src={draftPhoto}
          alt="Profile preview"
          className="profile-preview-image"
        />
      );
    }

    const cleanUsername = draftUsername.replace(/^@/, "").trim();
    const fallback = cleanUsername
      ? cleanUsername.slice(0, 2).toUpperCase()
      : "NP";

    return <div className="profile-preview-empty">{fallback}</div>;
  }, [draftPhoto, draftUsername]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      setSelectedFile(null);
      return;
    }

    setMessage("");
    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);
    setDraftPhoto(localPreview);
  };

  const uploadToCloudinary = async (): Promise<string> => {
    if (!selectedFile) {
      return photo;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Failed to upload image.");
    }

    return data.secure_url as string;
  };

  const handleSave = async () => {
    const cleanUsername = draftUsername.trim();

    if (!cleanUsername) {
      setMessage("Username is required.");
      return;
    }

    if (!cleanUsername.startsWith("@")) {
      setMessage("Username must start with @.");
      return;
    }

    try {
      setMessage("");
      setIsUploading(true);

      const finalPhotoUrl = selectedFile
        ? await uploadToCloudinary()
        : photo.trim();

      onSave({
        username: cleanUsername.replace(/^@/, ""),
        photo: finalPhotoUrl,
      });
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to upload image.";
      setMessage(errMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-edit-card">
      <div className="profile-edit-header">
        <div>
          <h3>Edit Profile</h3>
          <p>Update your username and profile photo.</p>
        </div>
      </div>

      <div className="profile-edit-preview-wrap">{previewContent}</div>

      <div className="profile-form-group">
        <label htmlFor="profilePhotoFile">Profile Photo</label>
        <input
          id="profilePhotoFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <p className="profile-helper-text">
          Select an image file to upload to Cloudinary.
        </p>
      </div>

      <div className="profile-form-group">
        <label htmlFor="profileUsername">Username</label>
        <input
          id="profileUsername"
          type="text"
          value={draftUsername}
          onChange={(e) => setDraftUsername(e.target.value)}
          placeholder="@yourhandle"
        />
      </div>

      <div className="profile-edit-actions">
        <button
          type="button"
          className="profile-primary-btn"
          onClick={handleSave}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Save Changes"}
        </button>
        <button
          type="button"
          className="profile-secondary-btn"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>

      {message ? <p className="profile-message">{message}</p> : null}
    </div>
  );
}