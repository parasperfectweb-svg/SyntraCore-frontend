// src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword, validatePassword } from "../../api/authApi";
import AuthLayout from "../../layout/AuthLayout";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otpCode = location.state?.otpCode || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const passError = validatePassword(form.password);
    if (passError) {
      setError(passError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      // POST /api/auth/reset-password/
      await resetPassword(email, form.password, form.confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
      </div>

      {error && <div className="alert alert-danger py-2 mt-2 fs-6">{error}</div>}
      {success && (
        <div className="alert alert-success py-2 mt-2 fs-6">
          Password reset successfully! Redirecting to login…
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">New Password</label>
          <div className="auth-input-wrapper position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control auth-input pe-5"
              placeholder="Enter new password"
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="auth-password-toggle position-absolute end-0 top-50 translate-middle-y btn border-0 bg-transparent text-muted"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="auth-form-group mb-4">
          <label className="form-label fw-bold">Confirm New Password</label>
          <div className="auth-input-wrapper position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control auth-input pe-5"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="auth-password-toggle position-absolute end-0 top-50 translate-middle-y btn border-0 bg-transparent text-muted"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-button py-2"
          disabled={submitting || success}
        >
          {submitting ? "Resetting…" : "Reset Password"}
        </button>
      </form>

      <div className="auth-switch text-center mt-3">
        <Link to="/login">Back to Login</Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;