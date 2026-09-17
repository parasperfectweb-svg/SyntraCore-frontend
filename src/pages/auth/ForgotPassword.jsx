// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../api/authApi";
import AuthLayout from "../../layout/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // See Login.jsx for why noValidate + explicit checks are needed here
    // instead of relying on required/type="email": native validation
    // blocks the submit event silently when the format is invalid, so
    // handleSubmit never even runs, and .auth-wrapper's overflow: hidden
    // clips the one bit of native feedback the browser would show anyway.
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      await forgotPassword(trimmedEmail);
      navigate("/verify-otp", {
        state: { email: trimmedEmail, isReset: true },
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to send reset code."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-3">
        <Link to="/login" className="text-decoration-none d-inline-flex align-items-center gap-1 text-muted small fw-semibold">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>

      <div className="auth-form-header">
        <h2>Forgot Password</h2>
        <p>Enter your account's email address below and we'll send you an OTP verification code.</p>
      </div>

      {error && <div className="alert alert-danger py-2 mt-2 fs-6">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <div className="auth-form-group mb-4">
          <label className="form-label fw-bold">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control auth-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-button py-2"
          disabled={submitting}
        >
          {submitting ? "Sending Code…" : "Send Reset Code"}
        </button>
      </form>

      <div className="auth-switch text-center mt-4">
        <span>Remembered your password?</span> <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;