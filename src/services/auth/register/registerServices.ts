// services/auth/register/registerServices.ts
import { RegisterDto } from "@/app/services/types/user";

export const registerServices = async (
  data: RegisterDto,
  role: string
) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("FullName", data.fullName);
    formData.append("Email", data.email);
    formData.append("Password", data.password);
    formData.append("Role", role === "client" ? "Client" : "Freelancer");
    formData.append("PhoneNumber", data.phoneNumber);

    // Log the form data entries for debugging
    console.log("Sending FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const res = await fetch(
      "http://proafree.runasp.net/api/User/register",
      {
        method: "POST",
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      }
    );

    const result = await res.json();
    
    console.log("Registration response:", result);
    
    if (!res.ok) {
      // Handle validation errors
      if (res.status === 400 && result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(result.message || result.title || "Registration failed");
    }

    return result;
  } catch (error: any) {
    console.error("Registration API error:", error);
    throw error;
  }
};