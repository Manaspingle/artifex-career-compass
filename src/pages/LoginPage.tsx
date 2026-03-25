import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { setToken } from "@/lib/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: { name?: string; email: string; password: string } = {
        email: form.email,
        password: form.password,
      };
      if (mode === "register") body.name = form.name;

      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const baseApi = import.meta.env.VITE_API_BASE || "http://localhost:4000";
      const res = await fetch(`${baseApi}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      setToken(data.token);
      toast.success(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
      navigate("/tracker");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h1>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <Input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          )}
          <Input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {mode === "login" ? "Don’t have an account?" : "Already have an account?"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="ml-2 text-primary underline">
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
