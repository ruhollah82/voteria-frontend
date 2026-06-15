import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              V
            </div>
            <h1 className="text-xl font-semibold text-card-foreground">
              {mode === "login" ? "Sign in to Voteria" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to continue."
                : "Pick a username and password to get started."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-muted p-0.5">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  clearError();
                  setMode(m);
                }}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors capitalize",
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Username
              </label>
              <Input
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !username.trim() || !password.trim()}
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
