
// app/auth/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";

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

import { LoginDto } from "../../services/types/user";
import { loginServices } from "@/services/auth/login/loginServices";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    try {
      const res = await loginServices(data);
      console.log('Login response:', res);
      
      // Store both token and user data
      login(res.token, res.user);
      
      console.log("User role:", res.user.role);
      
      // Role-based redirect
      if (res.user.role === "Client") {
        router.push("/dashboard/client");
      } else if (res.user.role === "Freelancer") {
        router.push("/projects");
      } else {
        router.push("/dashboard");
      }
      
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your email and password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label>Password</label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
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
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Sign In"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="text-center text-sm">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}