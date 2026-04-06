export type StoredUser = {
  userId: string;
  userEmail?: string;
  userUsername?: string;
  userLastName?: string;
  userFirstName?: string;
  userTier: number;
  mustChangePass: number;
  userStatus: number;
};

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem("user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getStoredUserTier(): number | null {
  const user = getStoredUser();
  return user ? user.userTier : null;
}