const API_BASE_URL = "http://localhost:5023";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type UpdateProfilePayload = {
  username: string;
};

type UpdateProfilePhotoPayload = {
  photo: string;
};

function getAuthHeaders(includeJson = true): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getCurrentUser(): Record<string, unknown> | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getCurrentUserId(): string | null {
  const parsedUser = getCurrentUser();

  if (!parsedUser) return null;

  const value =
    parsedUser.id ??
    parsedUser.userId ??
    parsedUser.UserId ??
    parsedUser.userid ??
    "";

  const userId = String(value).trim();
  return userId || null;
}

function saveMergedUserFields(fields: Record<string, unknown>) {
  const currentUser = getCurrentUser();

  if (!currentUser) return;

  const updatedUser = {
    ...currentUser,
    ...fields,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : typeof data === "string"
          ? data
          : "Request failed.";

    throw new Error(errorMessage);
  }

  return data;
}

export async function changeMyPassword(payload: ChangePasswordPayload) {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/Auth/change-password/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse(response);
}

export async function deactivateMyAccount() {
  const userId = getCurrentUserId();
  const currentUser = getCurrentUser();

  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  const userTierValue =
    currentUser?.userTier ??
    currentUser?.UserTier ??
    localStorage.getItem("role");

  let resolvedTier: number | null = null;

  if (userTierValue === 0 || userTierValue === 1 || userTierValue === 2) {
    resolvedTier = Number(userTierValue);
  } else if (userTierValue === "AppAdmin") {
    resolvedTier = 0;
  } else if (userTierValue === "Admin") {
    resolvedTier = 1;
  } else if (userTierValue === "Student") {
    resolvedTier = 2;
  }

  if (resolvedTier === null) {
    throw new Error("User tier not found in localStorage.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/User/deactivate/${userId}?userTier=${resolvedTier}`,
    {
      method: "PUT",
      headers: getAuthHeaders(false),
    },
  );

  return handleResponse(response);
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const userId = getCurrentUserId();
  const currentUser = getCurrentUser();

  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  const firstName = String(
    currentUser?.userFirstName ?? currentUser?.UserFirstName ?? "",
  ).trim();
  const lastName = String(
    currentUser?.userLastName ?? currentUser?.UserLastName ?? "",
  ).trim();
  const email = String(
    currentUser?.userEmail ?? currentUser?.UserEmail ?? "",
  ).trim();

  if (!firstName || !lastName || !email) {
    throw new Error("Current user profile details are incomplete.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/Auth/update-profile/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        userFirstName: firstName,
        userLastName: lastName,
        userEmail: email,
        userUsername: payload.username.trim(),
      }),
    },
  );

  const data = await handleResponse(response);

  if (typeof data === "object" && data !== null) {
    saveMergedUserFields({
      userUsername: (data as Record<string, unknown>).userUsername ?? payload.username.trim(),
      UserUsername: (data as Record<string, unknown>).userUsername ?? payload.username.trim(),
      userEmail: (data as Record<string, unknown>).userEmail ?? email,
      UserEmail: (data as Record<string, unknown>).userEmail ?? email,
      userFirstName: (data as Record<string, unknown>).userFirstName ?? firstName,
      UserFirstName: (data as Record<string, unknown>).userFirstName ?? firstName,
      userLastName: (data as Record<string, unknown>).userLastName ?? lastName,
      UserLastName: (data as Record<string, unknown>).userLastName ?? lastName,
    });
  }

  return data;
}

export async function updateMyProfilePhoto(payload: UpdateProfilePhotoPayload) {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/Auth/update-photo/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        userPhoto: payload.photo,
      }),
    },
  );

  const data = await handleResponse(response);

  if (typeof data === "object" && data !== null) {
    saveMergedUserFields({
      userPhoto: (data as Record<string, unknown>).userPhoto ?? payload.photo,
      UserPhoto: (data as Record<string, unknown>).userPhoto ?? payload.photo,
    });
  }

  return data;
}