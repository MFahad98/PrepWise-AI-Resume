import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Hooks/useAuth.js";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (error) {
      const responseMessage = error.response?.data?.message;
      setErrorMessage(
        responseMessage ||
          (error.response
            ? "Login failed. Please check your details and try again."
            : "Unable to connect to the server. Please try again.")
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <h1 className="text-lg font-semibold text-slate-600">Signing you in...</h1>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-900/50">
            ✦
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ResumeAI</span>
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur">
            AI-Powered Interview Prep
          </p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
            Walk into every interview
            <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              fully prepared.
            </span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Upload your resume, match it with any job description and get tailored
            questions, skill gaps and a day-by-day roadmap.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Personalised technical & behavioural questions",
              "Instant job match score",
              "Step-by-step preparation roadmap",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
                  ✓
                </span>
                {text}
              </li>
            ))}
          </ul>
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your details to sign in to your account.
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:translate-y-0 active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Create Account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-slate-400">
            🔒 Secure access to your account
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
