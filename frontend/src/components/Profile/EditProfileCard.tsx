import { useState } from "react";
import "./ProfileShared.css";

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
  const [message, setMessage] = useState("");

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
      photo,
    });
  };

  return (
    <div className="profile-edit-card">
      <h3>Edit Profile</h3>

      <div className="profile-edit-preview">
        {photo ? (
          <img src={photo} alt="Preview" className="profile-preview-image" />
        ) : (
          <div className="profile-preview-empty">No photo yet</div>
        )}
      </div>

      <div className="profile-disabled-block">
        <label>Profile Photo</label>
        <div className="profile-disabled-input">Not available yet</div>
        <p className="profile-helper-text">
          Profile photo editing has no access/function yet.
        </p>
      </div>

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
    </div>
  );
}
