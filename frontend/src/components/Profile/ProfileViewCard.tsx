import "./ProfileShared.css";

type ProfileStats = {
  label: string;
  value: number;
};

type Collaboration = {
  name: string;
  subject: string;
};

type ProfileViewCardProps = {
  fullName: string;
  username: string;
  email: string;
  status: string;
  role: string;
  photo?: string;
  stats?: ProfileStats[];
  collaborations?: Collaboration[];
  onEdit: () => void;
};

export default function ProfileViewCard({
  fullName,
  username,
  email,
  status,
  role,
  photo,
  stats = [],
  collaborations = [],
  onEdit,
}: ProfileViewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {photo ? (
            <img src={photo} alt="Profile" className="profile-avatar-image" />
          ) : (
            <div className="profile-avatar-fallback">
              {getInitials(fullName)}
            </div>
          )}
        </div>

        <div className="profile-heading">
          <span className="profile-status">{status}</span>
          <p className="profile-role-label">{role}</p>
          <h2>{fullName}</h2>
          <p>@{username}</p>
          <p>{email}</p>
        </div>

        <button className="profile-edit-btn" onClick={onEdit} type="button">
          Edit Profile
        </button>
      </div>

      {stats.length > 0 && (
        <div className="profile-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="profile-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      )}

      {collaborations.length > 0 && (
        <div className="profile-collaborations">
          <h3>Collaborations</h3>
          <div className="profile-collab-list">
            {collaborations.map((item) => (
              <div key={item.name} className="profile-collab-card">
                <div className="profile-collab-avatar">
                  {getInitials(item.name)}
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
