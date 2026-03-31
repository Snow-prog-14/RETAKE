import { ChangeEvent, useMemo, useState } from "react";
import "./ProfileShared.css";

type EditProfileCardProps = {
  username: string;
  photo?: string;
  onCancel: () => void;
  onSave: (data: { username: string; photo: string }) => void;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  onDeactivate: () => void;
};

export default function EditProfileCard({
  username,
  photo = "",
  onCancel,
  onSave,
  onChangePassword,
  onDeactivate,
}: EditProfileCardProps) {
  const [draftUsername, setDraftUsername] = useState(
    username.startsWith("@") ? username : `@${username}`,
  );
  const [draftPhoto, setDraftPhoto] = useState(photo);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const previewPhoto = useMemo(() => draftPhoto || "", [draftPhoto]);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setDraftPhoto(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const cleanUsername = draftUsername.trim();

    if (!cleanUsername) {
      setMessage("Username is required.");
      return;
    }

    if (!cleanUsername.startsWith("@")) {
      setMessage("Username must start with @.");
      return;
    }

    setMessage("");
    onSave({
      username: cleanUsername.replace(/^@/, ""),
      photo: draftPhoto,
    });
  };

  const handlePasswordSubmit = () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setPasswordMessage("");
    onChangePassword(passwords);

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-edit-card">
      <h3>Edit Profile</h3>

      <div className="profile-edit-preview">
        {previewPhoto ? (
          <img
            src={previewPhoto}
            alt="Preview"
            className="profile-preview-image"
          />
        ) : (
          <div className="profile-preview-empty">No photo selected</div>
        )}
      </div>

      <label>
        Profile Photo
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </label>

      <label>
        Username (handles, @___)
        <input
          type="text"
          value={draftUsername}
          onChange={(e) => setDraftUsername(e.target.value)}
          placeholder="@yourhandle"
        />
      </label>

      <div className="profile-edit-actions">
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {message ? <p className="profile-message">{message}</p> : null}

      <div className="profile-password-box">
        <h4>Password</h4>

        <label>
          Current Password
          <div className="profile-password-field">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
            >
              {showPasswords.current ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label>
          New Password
          <div className="profile-password-field">
            <input
              type={showPasswords.next ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  next: !prev.next,
                }))
              }
            >
              {showPasswords.next ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label>
          Confirm Password
          <div className="profile-password-field">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            >
              {showPasswords.confirm ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          type="button"
          className="profile-password-btn"
          onClick={handlePasswordSubmit}
        >
          Update Password
        </button>

        {passwordMessage ? (
          <p className="profile-message">{passwordMessage}</p>
        ) : null}
      </div>

      <div className="profile-danger-zone">
        <h4>Deactivate Profile</h4>
        <p>This will disable your account until an admin reactivates it.</p>
        <button
          type="button"
          className="profile-danger-btn"
          onClick={onDeactivate}
        >
          Deactivate Profile
        </button>
      </div>
    </div>
  );
}
