import EditProfileCard from "./EditProfileCard";
import "./ProfileShared.css";

type EditProfileModalProps = {
  isOpen: boolean;
  username: string;
  photo?: string;
  onClose: () => void;
  onSave: (data: { username: string; photo: string }) => void;
};

export default function EditProfileModal({
  isOpen,
  username,
  photo = "",
  onClose,
  onSave,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <EditProfileCard
          username={username}
          photo={photo}
          onCancel={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
