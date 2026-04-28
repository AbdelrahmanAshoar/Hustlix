// app/auth/register/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { RegisterDto } from "../../services/types/user";
import { useState } from "react";
import { registerServices } from "@/services/auth/register/registerServices";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, User, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [typeUser, setTypeUser] = useState<"client" | "freelancer">("client");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    }
  });

  const onSubmit = async (data: RegisterDto) => {
    // Validate phone number
    if (!data.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    // Clean phone number - remove any spaces, dashes, parentheses
    const cleanPhoneNumber = data.phoneNumber.replace(/[\s\-\(\)\+]/g, '');
    
    if (cleanPhoneNumber.length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    const loadingToast = toast.loading("Creating your account...");
    
    try {
      console.log("Form data being sent:", {
        ...data,
        phoneNumber: cleanPhoneNumber
      });
      
      await registerServices({
        ...data,
        phoneNumber: cleanPhoneNumber
      }, typeUser);
      
      toast.success("Account created successfully!", {
        id: loadingToast,
        description: `Welcome to Hustlix! Redirecting you...`,
        duration: 3000,
      });
      
      // Redirect based on role
      setTimeout(() => {
        if (typeUser === "freelancer") {
          router.push("/projects");
        } else {
          router.push("/dashboard/client");
        }
      }, 1500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        id: loadingToast,
        description: error.message || "Something went wrong. Please check your information.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Choose your account type and enter your details to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* CLIENT */}
              <div
                onClick={() => setTypeUser("client")}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all text-center
                  ${
                    typeUser === "client"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <User className={`h-6 w-6 ${typeUser === "client" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h3 className="font-semibold text-sm">I'm a Client</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hiring for a project
                    </p>
                  </div>
                </div>
                {typeUser === "client" && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>

              {/* FREELANCER */}
              <div
                onClick={() => setTypeUser("freelancer")}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all text-center
                  ${
                    typeUser === "freelancer"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <Briefcase className={`h-6 w-6 ${typeUser === "freelancer" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h3 className="font-semibold text-sm">I'm a Freelancer</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Looking for work
                    </p>
                  </div>
                </div>
                {typeUser === "freelancer" && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fullName">
                Full name <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                disabled={isSubmitting}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="1234567890"
                disabled={isSubmitting}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Please enter a valid phone number (numbers only, 10-15 digits)",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter numbers only (e.g., 1234567890)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${typeUser === "client" ? "Client" : "Freelancer"} Account`
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}