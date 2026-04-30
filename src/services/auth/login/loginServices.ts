import { LoginDto } from "@/app/services/types/user";
import { API_BASE_URL } from "@/config";

export const loginServices=async(data:LoginDto)=>{
const res = await fetch(`${API_BASE_URL}/api/User/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Login failed");
  }

  // Fix profile picture URL to include full backend URL
  if (result.user && result.user.profilePictureUrl) {
    result.user.profilePictureUrl = `${API_BASE_URL}${result.user.profilePictureUrl}`;
  }

  return result;
}