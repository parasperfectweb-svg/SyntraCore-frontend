// src/pages/auth/VerifyOtp.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  verifyOtp, 
  verifyResetOtp, 
  resendOtp, 
  resendResetOtp 
} from "../../api/authApi";
import AuthLayout from "../../layout/AuthLayout";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  const isReset = location.state?.isReset || false;

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Resend state management
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for Resend button
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle box-by-box digit input
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);

    // See Login.jsx for why this is needed instead of relying on
    // required/type="email" on the email + OTP box inputs — native
    // validation blocks the submit event silently (handleSubmit never
    // runs), and .auth-wrapper's overflow: hidden clips the one bit of
    // feedback the browser would otherwise show. noValidate on the form
    // turns that off so this always runs and always shows something.
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setSubmitting(true);

    try {
      if (isReset) {
        await verifyResetOtp(trimmedEmail, Number(fullOtp));
        setSuccess(true);
        setTimeout(() => {
          navigate("/reset-password", { state: { email: trimmedEmail, otpCode: Number(fullOtp) }, replace: true });
        }, 1500);
      } else {
        await verifyOtp(trimmedEmail, Number(fullOtp));
        setSuccess(true);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Resend Handler
  const handleResendOtp = async () => {
    if (!email) {
      setError("Please enter your email address to resend the code.");
      return;
    }

    setError(null);
    setResendMessage(null);
    setResending(true);

    try {
      if (isReset) {
        await resendResetOtp(email);
      } else {
        await resendOtp(email);
      }

      setResendMessage("A new verification code has been sent to your email.");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2>{isReset ? "Verify Reset Code" : "Verify Your Email"}</h2>
        <p>Enter the code we sent to your email address.</p>
      </div>

      {error && <div className="alert alert-danger py-2 mt-2 fs-6">{error}</div>}
      {resendMessage && <div className="alert alert-info py-2 mt-2 fs-6">{resendMessage}</div>}
      {success && (
        <div className="alert alert-success py-2 mt-2 fs-6">
          {isReset
            ? "Code verified! Redirecting to reset password…"
            : "Account verified! Redirecting to login…"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control auth-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Boxed OTP Input Container */}
        <div className="auth-form-group mb-3">
          <label className="form-label fw-bold">Verification Code</label>
          <div className="d-flex justify-content-between align-items-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="form-control text-center fs-4 otp-box"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                required
              />
            ))}
          </div>
        </div>

        {/* Resend OTP Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-muted fs-6">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none fw-semibold"
            onClick={handleResendOtp}
            disabled={!canResend || resending}
          >
            {resending
              ? "Sending…"
              : canResend
                ? "Resend Code"
                : `Resend in ${timer}s`}
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-button py-2"
          disabled={submitting || success}
        >
          {submitting ? "Verifying…" : "Verify Account"}
        </button>
      </form>

      <div className="auth-switch text-center mt-3">
        <span>Already verified?</span> <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;