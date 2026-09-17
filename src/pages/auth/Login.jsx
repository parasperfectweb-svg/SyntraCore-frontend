// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login as loginApi } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import AuthLayout from "../../layout/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Real validation now happens here instead of relying on the browser's
    // native HTML5 validation UI (required / type="email"). That native
    // validation still runs first and, when it fails, silently blocks the
    // submit event from ever firing — no submit event means handleSubmit
    // never runs, so there's no console output and no request, nothing to
    // debug. It's silent for a second reason too: .auth-wrapper (global.css)
    // has overflow: hidden for its rounded-card look, which clips the
    // native validation tooltip the browser would otherwise show next to
    // the invalid field — so even the one bit of native feedback that
    // exists is invisible here. noValidate on the form (below) turns that
    // native blocking off entirely so this always runs and always gives
    // visible feedback via the error banner instead.
    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await loginApi(email, password);

      dispatch(
        setCredentials({
          access: data.access,
          refresh: data.refresh,
          user: data.user || { email: form.email },
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Invalid email or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your logistics dashboard.</p>
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
            required
          />
        </div>

        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Password</label>
          <div className="auth-input-wrapper position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control auth-input auth-password-input pe-5"
              placeholder="Enter your password"
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

        <div className="d-flex justify-content-between align-items-center mb-4">
          <label className="form-check d-flex align-items-center gap-2 mb-0">
            <input type="checkbox" className="form-check-input mt-0" />
            <span className="small text-muted">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="small text-primary text-decoration-none fw-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-button py-2"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="auth-switch text-center mt-3">
        <span>Don't have an account?</span> <Link to="/register">Register</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;