import api from './axios';

/**
 * Validates password rules:
 * - At least 8 characters
 * - At least 1 lowercase letter (a-z)
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 number (0-9)
 * - At least 1 special character
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least 1 lowercase letter.';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least 1 uppercase letter.';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least 1 number.';
  }
  if (!/(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return 'Password must contain at least 1 special character.';
  }
  return null;
};

// POST /api/auth/signup/ body: { email, password }
export const signup = (email, password) =>
  api.post('/api/auth/signup/', { email, password }).then((res) => res.data);

// POST /api/auth/verify-otp/ body: { email, otp_code }
export const verifyOtp = (email, otpCode) =>
  api.post('/api/auth/verify-otp/', { email, otp_code: otpCode }).then((res) => res.data);

// POST /api/auth/resend-otp/ body: { email } (Resend OTP for registration)
export const resendOtp = (email) =>
  api.post('/api/auth/resend-otp/', { email }).then((res) => res.data);

// POST /api/auth/token/ body: { email, password }
export const login = (email, password) =>
  api.post('/api/auth/token/', { email, password }).then((res) => res.data);

// POST /api/auth/forgot-password/ body: { email }
export const forgotPassword = (email) =>
  api.post('/api/auth/forgot-password/', { email }).then((res) => res.data);

// POST /api/auth/verify-reset-otp/ body: { email, otp_code }
export const verifyResetOtp = (email, otpCode) =>
  api.post('/api/auth/verify-reset-otp/', { email, otp_code: otpCode }).then((res) => res.data);

// POST /api/auth/forgot-password/ body: { email } (Resend OTP for password reset)
export const resendResetOtp = (email) =>
  api.post('/api/auth/forgot-password/', { email }).then((res) => res.data);



// POST /api/auth/reset-password/ body: { email, password, confirm_password }
export const resetPassword = (email, password, confirmPassword) =>
  api
    .post('/api/auth/reset-password/', {
      email,
      password,
      confirm_password: confirmPassword,
    })
    .then((res) => res.data);

// POST /api/auth/change-password/ (Bearer token attached automatically via axios instance)
export const changePassword = (email, oldPassword, newPassword) =>
  api
    .post('/api/auth/change-password/', {
      email,
      old_password: oldPassword,
      new_password: newPassword,
    })
    .then((res) => res.data);

    