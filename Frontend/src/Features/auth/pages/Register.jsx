import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Hooks/useAuth.js";

const Register = () => {
  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await handleRegister({ username, email, password });

      setSuccessMessage("Account created successfully!");

      navigate("/login");
    } catch (error) {
      const responseMessage = error.response?.data?.message;

      setErrorMessage(
        responseMessage ||
          (error.response
            ? "Registration failed. Please try again."
            : "Unable to connect to the server. Please try again.")
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <h1 className="text-lg font-semibold text-slate-600">Creating account...</h1>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-900/50">
            ✦
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ResumeAI</span>
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur">
            Free to get started
          </p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
            Your career journey
            <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              starts with one account.
            </span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Create your profile in seconds and unlock AI-driven interview
            preparation tailored to your resume and target role.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "3", label: "Prep modules" },
              { value: "AI", label: "Powered" },
              { value: "24/7", label: "Access" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">© ResumeAI. All rights reserved.</p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
              ✦
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">ResumeAI</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign up to get started with your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {errorMessage && (
              <div
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                <span className="mt-0.5">⚠</span>
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div
                className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                role="status"
              >
                <span className="mt-0.5">✓</span>
                <p>{successMessage}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="username"
                required
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Use at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Sign In
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-slate-400">
            🔒 Your information is securely handled
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
