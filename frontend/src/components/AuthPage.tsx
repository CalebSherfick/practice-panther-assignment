import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firmName: z.string().optional(),
});

type AuthForm = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthForm) => {
    setIsLoading(true);
    setError("");

    // Validate firmName for signup
    if (!isLogin && !data.firmName?.trim()) {
      setFormError("firmName", { message: "Firm name is required" });
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password, data.firmName!);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    reset();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side - Hero Content */}
      <div className="order-2 lg:order-1 flex items-center justify-center bg-[#003bcb] p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <img
              src="https://v.fastcdn.co/t/5cdc982a/c9150068/1755513153-60494700-396x57-PracticePanther-Hori.png"
              alt="Practice Panther"
              className="h-12 mx-auto mb-4"
            />
          </div>
          <p className="text-lg font-bold text-white mb-6">
            Legal Case Management System
          </p>
          <p className="text-white">
            Streamline your law firm's workflow with our comprehensive case
            management solution.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="order-1 lg:order-2 flex items-center justify-center p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Log in" : "Create account"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? "Please enter your credentials to access your account"
                : "Please fill in your details to create your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email address*
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password*
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="****************"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Firm Name Field (for signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Firm Name*
                </label>
                <input
                  {...register("firmName")}
                  type="text"
                  placeholder="Your law firm name"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
                />
                {errors.firmName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firmName.message}
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLogin
                  ? "bg-[#19b475] hover:bg-[#158f5f] focus:ring-[#19b475]"
                  : "bg-[#0337cc] hover:bg-[#002ba3] focus:ring-[#003bcb]"
              } text-white font-bold text-lg uppercase py-4 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {isLoading ? "Loading..." : isLogin ? "Log in" : "Create account"}
            </button>

            {/* Button to toggle between login/signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="bg-[#252525] hover:bg-[#1a1a1a] text-white font-bold text-sm uppercase py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252525] transition-colors"
              >
                {isLogin
                  ? "New account?"
                  : "Back to login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
