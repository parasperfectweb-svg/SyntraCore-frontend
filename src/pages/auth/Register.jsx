// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signup, validatePassword } from "../../api/authApi";
import AuthLayout from "../../layout/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // See Login.jsx for why this is here instead of relying on the
    // required/type="email" attributes: native validation blocks the
    // submit event silently (handleSubmit never runs at all) and its one
    // bit of visual feedback gets clipped invisible by .auth-wrapper's
    // overflow: hidden anyway. noValidate on the form turns that off so
    // this always runs and always shows something via the error banner.
    const email = form.email.trim();
    if (!email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms & Conditions to continue.');
      return;
    }

    // Validate password rules (8+ chars, 1 lower, 1 upper, 1 number, 1 special char)
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, form.password);
      navigate("/verify-otp", { state: { email }, replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2>Create Account</h2>
        <p>Create your account to get started.</p>
      </div>

      {error && <div className="alert alert-danger py-2 mt-2 fs-6">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control auth-input"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
          />
        </div>

        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Password</label>
          <div className="auth-input-wrapper position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control auth-input auth-password-input pe-5"
              placeholder="Create a password"
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

        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Confirm Password</label>
          <div className="auth-input-wrapper position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control auth-input auth-password-input pe-5"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />

            <button
              type="button"
              className="auth-password-toggle position-absolute end-0 top-50 translate-middle-y btn border-0 bg-transparent text-muted"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-check d-flex align-items-center gap-2 mb-0">
            <input
              type="checkbox"
              className="form-check-input mt-0"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (error) setError(null);
              }}
            />
            <span className="small text-muted">
              I agree to the{" "}
              <a href="#" className="auth-link">
                Terms & Conditions
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-button py-2"
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="auth-switch text-center mt-3">
        <span>Already have an account?</span> <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;