// src/layout/AuthLayout.jsx
import { Truck, ShieldCheck, Clock3 } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        {/* Left Section - Brand Info */}
        <div className="auth-brand-section">
          <div className="auth-brand">
            <div className="auth-logo">
              <Truck size={23} />
            </div>

            <h1>SyntraCore</h1>

            <p>
              Manage your logistics operations, shipments, and freight
              activities from one simple dashboard.
            </p>
          </div>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Truck size={16} />
              </div>
              <span>Manage your freight operations</span>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                <ShieldCheck size={16} />
              </div>
              <span>Secure and reliable platform</span>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Clock3 size={16} />
              </div>
              <span>Track operations in real time</span>
            </div>
          </div>
        </div>

        {/* Right Section - Form Content */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}