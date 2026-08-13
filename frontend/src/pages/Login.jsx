import { useState } from "react";
import {
  Truck,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

function Login({ onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      localStorage.setItem(
        "fleetops_token",
        data.access_token
      );

      localStorage.setItem(
        "fleetops_user",
        JSON.stringify(data.user)
      );

      onLogin(data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <button
          className="auth-back"
          onClick={onBack}
        >
          ← Back to FleetOps
        </button>

        <div className="auth-brand">

          <div className="brand-icon">
            <Truck size={22} />
          </div>

          <div>
            <strong>FleetOps</strong>
            <span>Maintenance Platform</span>
          </div>

        </div>

        <div className="auth-content">

          <span className="auth-label">
            WELCOME BACK
          </span>

          <h1>
            Manage your fleet
            <span> smarter.</span>
          </h1>

          <p>
            Sign in to access your fleet management
            dashboard, maintenance schedules and
            service records.
          </p>

          <div className="auth-benefit">

            <ShieldCheck size={19} />

            <div>
              <strong>
                Secure fleet management
              </strong>

              <span>
                Your account and maintenance data
                are protected.
              </span>
            </div>

          </div>

        </div>

      </div>


      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Sign in
            </h2>

            <p>
              Enter your account details to continue.
            </p>

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <form onSubmit={handleLogin}>

            <label>
              Email address
            </label>

            <div className="auth-input">

              <Mail size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            <label>
              Password
            </label>

            <div className="auth-input">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>

            <button
              onClick={onRegister}
            >
              Create account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;