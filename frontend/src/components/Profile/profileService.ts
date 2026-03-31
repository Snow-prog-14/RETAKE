const API_BASE_URL = "http://localhost:5023";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

function getAuthHeaders(includeJson = true): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getCurrentUserId(): string | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) return null;

  try {
    const parsedUser = JSON.parse(rawUser);

    return String(
      parsedUser.id ??
        parsedUser.userId ??
        parsedUser.UserId ??
        parsedUser.userid ??
        ""
    ) || null;
  } catch {
    return null;
  }
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
    }
  );

  return handleResponse(response);
}

export async function deactivateMyAccount() {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/User/deactivate/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(false),
    }
  );

  return handleResponse(response);
}

/*
  Username update is NOT wired yet because no matching backend endpoint
  is visible in current Swagger.
*/
export async function updateMyProfile() {
  throw new Error("Profile update endpoint is not available yet.");
}