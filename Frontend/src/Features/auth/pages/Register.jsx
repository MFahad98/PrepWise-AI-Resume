import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import Spinner from "../../../components/ui/Spinner";
import { AlertIcon } from "../../../components/ui/Icons";

const Register = () => {
  const { user, handleRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      // Backend register par hi login cookie set kar deta hai
      await handleRegister({ username: username.trim(), email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          (error.response
            ? "Registration failed. Please try again."
            : "Unable to connect to the server. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start generating personalized interview reports in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/10" role="alert">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {errorMessage}
          </p>
        )}

        <div>
          <label htmlFor="username" className="label">Full name</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Muhammad Fahad"
            autoComplete="name"
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
          {submitting && <Spinner className="h-4 w-4" />}
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-xs text-slate-500">
          Your data is only used to generate your reports.
        </p>
      </form>
    </AuthShell>
  );
};

export default Register;
