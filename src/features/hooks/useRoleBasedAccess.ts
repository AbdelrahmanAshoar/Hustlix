// // hooks/useRoleBasedAccess.ts
// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export function useRoleBasedAccess(allowedRoles: string[], fallbackPath?: string) {
//   const { isAuthenticated, userRole, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading) {
//       if (!isAuthenticated) {
//         router.push(fallbackPath || "/auth/login");
//       } else if (userRole && !allowedRoles.includes(userRole)) {
//         // Redirect based on role
//         if (userRole === "Admin") {
//           router.push("/dashboard/admin");
//         } else if (userRole === "Client") {
//           router.push("/dashboard/client");
//         } else if (userRole === "Freelancer") {
//           router.push("/dashboard/freelancer");
//         } else {
//           router.push("/dashboard");
//         }
//       }
//     }
//   }, [isAuthenticated, userRole, isLoading, allowedRoles, fallbackPath, router]);

//   return {
//     isAuthorized: isAuthenticated && userRole && allowedRoles.includes(userRole),
//     isLoading,
//     userRole,
//   };
// }