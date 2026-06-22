import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { User, Lock, ArrowRight, MessageSquare, ArrowUp } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, loading, error, token, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!username.trim() || !password.trim()) return;
    const fn = mode === "login" ? login : register;
    const result = await fn(username.trim(), password);
    if (result.success) navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
        {/* Abstract background shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight">Voteria</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              {mode === "login" ? "Welcome back!" : "Join the community."}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              {mode === "login"
                ? "Sign in to continue your journey, upvote great content, and engage with amazing spaces."
                : "Create your account to start sharing, voting, and connecting with communities that matter to you."}
            </p>
          </div>

          {/* Dynamic Mock UI based on mode */}
          {mode === "register" ? (
            <div className="relative max-w-sm">
              <div className="absolute -top-4 -left-4 w-full h-full bg-secondary/10 dark:bg-secondary/20 rounded-2xl blur-xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trending Spaces
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        WD
                      </div>
                      <div>
                        <p className="text-sm font-semibold">v/webdev</p>
                        <p className="text-xs text-muted-foreground">
                          12.4k members
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                        GD
                      </div>
                      <div>
                        <p className="text-sm font-semibold">v/gamedev</p>
                        <p className="text-xs text-muted-foreground">
                          8.2k members
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative max-w-sm">
              <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 dark:bg-primary/20 rounded-2xl blur-xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">
                    WD
                  </div>
                  <div>
                    <p className="text-sm font-semibold">v/webdev</p>
                    <p className="text-xs text-muted-foreground">
                      Posted by u/dev_master
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  Just migrated our massive monolith to Vite and Tailwind v4.
                  Here's the before/after! 🚀
                </p>
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <ArrowUp className="size-3.5" /> 1.2k
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5" /> 342 comments
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 Voteria. Made with ❤️ by Ruhollah Naseri
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                V
              </div>
              <span className="text-2xl font-bold tracking-tight">Voteria</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access your account."
                : "Fill in the details below to get started."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="your_username"
                  className="pl-9 h-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="password"
                >
                  Password
                </label>
                {mode === "login" && (
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={loading || !username.trim() || !password.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Please wait…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider & Switch */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {mode === "login"
                  ? "New to Voteria?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={() => {
              clearError();
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </Button>
        </div>
      </div>
    </div>
  );
}
