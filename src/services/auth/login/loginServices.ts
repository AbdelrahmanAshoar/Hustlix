import { LoginDto } from "@/app/services/types/user";

export const loginServices=async(data:LoginDto)=>{
const res = await fetch("http://proafree.runasp.net/api/User/login", {
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

  return result;
}